package com.careerguidance.service.impl;

import com.careerguidance.constant.AssessmentCategoryName;
import com.careerguidance.constant.AssessmentSessionStatus;
import com.careerguidance.dto.request.AssessmentAnswerRequest;
import com.careerguidance.dto.response.AssessmentAnswerResponse;
import com.careerguidance.dto.response.AssessmentCategoryResponse;
import com.careerguidance.dto.response.AssessmentQuestionResponse;
import com.careerguidance.dto.response.AssessmentQuestionsByCategoryResponse;
import com.careerguidance.dto.response.AssessmentResultResponse;
import com.careerguidance.dto.response.AssessmentSessionResponse;
import com.careerguidance.entity.AssessmentAnswer;
import com.careerguidance.entity.AssessmentOption;
import com.careerguidance.entity.AssessmentQuestion;
import com.careerguidance.entity.AssessmentResult;
import com.careerguidance.entity.AssessmentSession;
import com.careerguidance.entity.User;
import com.careerguidance.exception.BadRequestException;
import com.careerguidance.exception.DuplicateAnswerException;
import com.careerguidance.exception.ResourceNotFoundException;
import com.careerguidance.exception.UnauthorizedException;
import com.careerguidance.mapper.AssessmentMapper;
import com.careerguidance.repository.AssessmentAnswerRepository;
import com.careerguidance.repository.AssessmentCategoryRepository;
import com.careerguidance.repository.AssessmentOptionRepository;
import com.careerguidance.repository.AssessmentQuestionRepository;
import com.careerguidance.repository.AssessmentResultRepository;
import com.careerguidance.repository.AssessmentSessionRepository;
import com.careerguidance.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AssessmentServiceImpl implements com.careerguidance.service.AssessmentService {
    private static final double TECHNICAL_WEIGHT = 0.35;
    private static final double APTITUDE_WEIGHT = 0.25;
    private static final double INTEREST_WEIGHT = 0.20;
    private static final double PERSONALITY_WEIGHT = 0.20;

    private final AssessmentCategoryRepository categoryRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final AssessmentOptionRepository optionRepository;
    private final AssessmentSessionRepository sessionRepository;
    private final AssessmentAnswerRepository answerRepository;
    private final AssessmentResultRepository resultRepository;
    private final UserRepository userRepository;
    private final AssessmentMapper assessmentMapper;

    public AssessmentServiceImpl(AssessmentCategoryRepository categoryRepository,
                                 AssessmentQuestionRepository questionRepository,
                                 AssessmentOptionRepository optionRepository,
                                 AssessmentSessionRepository sessionRepository,
                                 AssessmentAnswerRepository answerRepository,
                                 AssessmentResultRepository resultRepository,
                                 UserRepository userRepository,
                                 AssessmentMapper assessmentMapper) {
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.sessionRepository = sessionRepository;
        this.answerRepository = answerRepository;
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
        this.assessmentMapper = assessmentMapper;
    }

    @Override
    @Transactional
    public AssessmentSessionResponse startAssessment(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        AssessmentSession session = new AssessmentSession();
        session.setUser(user);
        session.setStatus(AssessmentSessionStatus.IN_PROGRESS);
        return assessmentMapper.toSessionResponse(sessionRepository.save(session));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentCategoryResponse> getCategories() {
        return categoryRepository.findAll().stream()
                .sorted(Comparator.comparing(category -> category.getName().ordinal()))
                .map(assessmentMapper::toCategoryResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentQuestionsByCategoryResponse> getQuestions() {
        Map<AssessmentCategoryName, AssessmentQuestionsByCategoryResponse> grouped = new LinkedHashMap<>();
        for (AssessmentQuestion question : questionRepository.findByIsActiveTrueOrderByCategoryNameAscDisplayOrderAsc()) {
            AssessmentQuestionsByCategoryResponse categoryGroup = grouped.computeIfAbsent(question.getCategory().getName(), ignored -> {
                AssessmentQuestionsByCategoryResponse response = new AssessmentQuestionsByCategoryResponse();
                response.setCategoryId(question.getCategory().getId());
                response.setCategoryName(question.getCategory().getName().name());
                response.setDescription(question.getCategory().getDescription());
                return response;
            });
            AssessmentQuestionResponse questionResponse = assessmentMapper.toQuestionResponse(question);
            questionResponse.setOptions(question.getOptions().stream()
                    .sorted(Comparator.comparing(AssessmentOption::getDisplayOrder))
                    .map(assessmentMapper::toOptionResponse)
                    .toList());
            categoryGroup.getQuestions().add(questionResponse);
        }
        return new ArrayList<>(grouped.values());
    }

    @Override
    @Transactional
    public AssessmentAnswerResponse saveAnswer(Long userId, AssessmentAnswerRequest request) {
        AssessmentSession session = getOwnedSession(userId, request.getSessionId());
        ensureSessionOpen(session);
        AssessmentQuestion question = getActiveQuestion(request.getQuestionId());
        AssessmentOption option = getOptionForQuestion(request.getOptionId(), question.getId());
        AssessmentAnswer answer = answerRepository.findBySessionIdAndQuestionId(request.getSessionId(), request.getQuestionId())
                .orElseGet(() -> {
                    AssessmentAnswer newAnswer = new AssessmentAnswer();
                    newAnswer.setSession(session);
                    newAnswer.setQuestion(question);
                    return newAnswer;
                });
        answer.setOption(option);
        answer.setScore(option.getScore());
        return assessmentMapper.toAnswerResponse(answerRepository.save(answer));
    }

    @Override
    @Transactional
    public AssessmentAnswerResponse updateAnswer(Long userId, Long answerId, AssessmentAnswerRequest request) {
        AssessmentAnswer answer = answerRepository.findByIdAndSessionUserId(answerId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment answer not found"));
        ensureSessionOpen(answer.getSession());
        if (!answer.getSession().getId().equals(request.getSessionId())) {
            throw new BadRequestException("Answer does not belong to the supplied assessment session");
        }
        answerRepository.findBySessionIdAndQuestionId(request.getSessionId(), request.getQuestionId())
                .filter(existing -> !existing.getId().equals(answerId))
                .ifPresent(existing -> {
                    throw new DuplicateAnswerException("Question already answered for this assessment session");
                });
        AssessmentQuestion question = getActiveQuestion(request.getQuestionId());
        AssessmentOption option = getOptionForQuestion(request.getOptionId(), question.getId());

        answer.setQuestion(question);
        answer.setOption(option);
        answer.setScore(option.getScore());
        return assessmentMapper.toAnswerResponse(answerRepository.save(answer));
    }

    @Override
    @Transactional
    public AssessmentResultResponse submitAssessment(Long userId, Long sessionId) {
        AssessmentSession session = getOwnedSessionWithAnswers(userId, sessionId);
        ensureSessionOpen(session);
        List<AssessmentAnswer> answers = answerRepository.findBySessionId(sessionId);
        if (answers.isEmpty()) {
            throw new BadRequestException("Cannot submit an assessment without answers");
        }

        AssessmentResultResponse response = generateResult(session, answers);
        session.setStatus(AssessmentSessionStatus.SUBMITTED);
        session.setCompletedAt(LocalDateTime.now());
        sessionRepository.save(session);
        return response;
    }

    @Override
    public double calculateTechnicalScore(List<AssessmentAnswer> answers) {
        return averageForCategory(answers, AssessmentCategoryName.TECHNICAL_SKILLS);
    }

    @Override
    public double calculateAptitudeScore(List<AssessmentAnswer> answers) {
        return averageForCategory(answers, AssessmentCategoryName.APTITUDE);
    }

    @Override
    public double calculateInterestScore(List<AssessmentAnswer> answers) {
        return averageForCategory(answers, AssessmentCategoryName.INTEREST);
    }

    @Override
    public String calculatePersonality(List<AssessmentAnswer> answers) {
        double score = averageForCategory(answers, AssessmentCategoryName.PERSONALITY);
        if (score >= 4.5) {
            return "Leader";
        }
        if (score >= 3.8) {
            return "Analytical";
        }
        if (score >= 3.0) {
            return "Creative";
        }
        if (score >= 2.2) {
            return "Communicator";
        }
        return "Researcher";
    }

    @Override
    @Transactional
    public AssessmentResultResponse generateResult(AssessmentSession session, List<AssessmentAnswer> answers) {
        resultRepository.findBySessionId(session.getId()).ifPresent(existing -> {
            throw new BadRequestException("Assessment result already exists for this session");
        });

        double technical = calculateTechnicalScore(answers);
        double aptitude = calculateAptitudeScore(answers);
        double interest = calculateInterestScore(answers);
        double personalityScore = averageForCategory(answers, AssessmentCategoryName.PERSONALITY);
        double overall = round(technical * TECHNICAL_WEIGHT
                + aptitude * APTITUDE_WEIGHT
                + interest * INTEREST_WEIGHT
                + personalityScore * PERSONALITY_WEIGHT);

        AssessmentResult result = new AssessmentResult();
        result.setSession(session);
        result.setTechnicalScore(technical);
        result.setAptitudeScore(aptitude);
        result.setInterestScore(interest);
        result.setPersonalityScore(personalityScore);
        result.setOverallScore(overall);
        result.setPersonalityType(calculatePersonality(answers));
        result.setRecommendedCategory(determineRecommendedCategory(answers, technical, aptitude, interest));

        AssessmentResult saved = resultRepository.save(result);
        session.setResult(saved);
        return enrichResultResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AssessmentResultResponse getResult(Long userId, Long sessionId) {
        AssessmentSession session = getOwnedSession(userId, sessionId);
        if (session.getStatus() != AssessmentSessionStatus.SUBMITTED) {
            throw new BadRequestException("Assessment has not been submitted yet");
        }
        AssessmentResult result = resultRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment result not found"));
        return enrichResultResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentResultResponse> getHistory(Long userId) {
        return sessionRepository.findByUserIdOrderByStartedAtDesc(userId).stream()
                .filter(session -> session.getStatus() == AssessmentSessionStatus.SUBMITTED)
                .map(session -> resultRepository.findBySessionId(session.getId())
                        .map(this::enrichResultResponse)
                        .orElse(null))
                .filter(response -> response != null)
                .toList();
    }

    private AssessmentSession getOwnedSession(Long userId, Long sessionId) {
        AssessmentSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment session not found"));
        if (!session.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Assessment session does not belong to the authenticated user");
        }
        return session;
    }

    private AssessmentSession getOwnedSessionWithAnswers(Long userId, Long sessionId) {
        AssessmentSession session = sessionRepository.findWithAnswersById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment session not found"));
        if (!session.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Assessment session does not belong to the authenticated user");
        }
        return session;
    }

    private AssessmentQuestion getActiveQuestion(Long questionId) {
        AssessmentQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment question not found"));
        if (!Boolean.TRUE.equals(question.getIsActive())) {
            throw new BadRequestException("Assessment question is not active");
        }
        return question;
    }

    private AssessmentOption getOptionForQuestion(Long optionId, Long questionId) {
        AssessmentOption option = optionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment option not found"));
        if (!option.getQuestion().getId().equals(questionId)) {
            throw new BadRequestException("Selected option does not belong to the question");
        }
        return option;
    }

    private void ensureSessionOpen(AssessmentSession session) {
        if (session.getStatus() == AssessmentSessionStatus.SUBMITTED) {
            throw new BadRequestException("Cannot modify a submitted assessment");
        }
    }

    private double averageForCategory(List<AssessmentAnswer> answers, AssessmentCategoryName categoryName) {
        return round(answers.stream()
                .filter(answer -> answer.getQuestion().getCategory().getName() == categoryName)
                .mapToInt(AssessmentAnswer::getScore)
                .average()
                .orElse(0.0));
    }

    private String determineRecommendedCategory(List<AssessmentAnswer> answers, double technical, double aptitude, double interest) {
        if (technical >= aptitude && technical >= interest) {
            return highestInterestArea(answers);
        }
        if (aptitude >= interest) {
            return "Data Science";
        }
        return highestInterestArea(answers);
    }

    private String highestInterestArea(List<AssessmentAnswer> answers) {
        List<String> areas = List.of("AI", "Software", "Data Science", "Cyber Security", "Cloud", "Business", "Design");
        Map<String, Integer> scores = new LinkedHashMap<>();
        areas.forEach(area -> scores.put(area, 0));
        answers.stream()
                .filter(answer -> answer.getQuestion().getCategory().getName() == AssessmentCategoryName.INTEREST)
                .forEach(answer -> {
                    String text = answer.getOption().getOptionText();
                    for (String area : areas) {
                        if (text != null && text.toLowerCase().contains(area.toLowerCase())) {
                            scores.merge(area, answer.getScore(), Integer::sum);
                            return;
                        }
                    }
                });
        return scores.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Software");
    }

    private AssessmentResultResponse enrichResultResponse(AssessmentResult result) {
        AssessmentResultResponse response = assessmentMapper.toResultResponse(result);
        Map<AssessmentCategoryName, Double> categoryScores = new EnumMap<>(AssessmentCategoryName.class);
        categoryScores.put(AssessmentCategoryName.TECHNICAL_SKILLS, result.getTechnicalScore());
        categoryScores.put(AssessmentCategoryName.APTITUDE, result.getAptitudeScore());
        categoryScores.put(AssessmentCategoryName.PERSONALITY, result.getPersonalityScore());
        categoryScores.put(AssessmentCategoryName.INTEREST, result.getInterestScore());

        response.setStrengths(categoryScores.entrySet().stream()
                .filter(entry -> entry.getValue() >= 3.5)
                .map(entry -> toReadableCategory(entry.getKey()))
                .toList());
        response.setWeaknesses(categoryScores.entrySet().stream()
                .filter(entry -> entry.getValue() > 0 && entry.getValue() < 3.0)
                .map(entry -> toReadableCategory(entry.getKey()))
                .toList());
        return response;
    }

    private String toReadableCategory(AssessmentCategoryName name) {
        return switch (name) {
            case TECHNICAL_SKILLS -> "Technical Skills";
            case APTITUDE -> "Aptitude";
            case PERSONALITY -> "Personality";
            case INTEREST -> "Interest";
        };
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
