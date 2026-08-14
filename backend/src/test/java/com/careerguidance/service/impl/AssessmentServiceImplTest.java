package com.careerguidance.service.impl;

import com.careerguidance.constant.AssessmentCategoryName;
import com.careerguidance.entity.AssessmentAnswer;
import com.careerguidance.entity.AssessmentCategory;
import com.careerguidance.entity.AssessmentQuestion;
import com.careerguidance.mapper.AssessmentMapper;
import com.careerguidance.repository.AssessmentAnswerRepository;
import com.careerguidance.repository.AssessmentCategoryRepository;
import com.careerguidance.repository.AssessmentOptionRepository;
import com.careerguidance.repository.AssessmentQuestionRepository;
import com.careerguidance.repository.AssessmentResultRepository;
import com.careerguidance.repository.AssessmentSessionRepository;
import com.careerguidance.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class AssessmentServiceImplTest {
    private final AssessmentServiceImpl service = new AssessmentServiceImpl(
            mock(AssessmentCategoryRepository.class),
            mock(AssessmentQuestionRepository.class),
            mock(AssessmentOptionRepository.class),
            mock(AssessmentSessionRepository.class),
            mock(AssessmentAnswerRepository.class),
            mock(AssessmentResultRepository.class),
            mock(UserRepository.class),
            mock(AssessmentMapper.class)
    );

    @Test
    void calculateTechnicalScoreReturnsAverageForTechnicalAnswersOnly() {
        List<AssessmentAnswer> answers = List.of(
                answer(AssessmentCategoryName.TECHNICAL_SKILLS, 4),
                answer(AssessmentCategoryName.TECHNICAL_SKILLS, 2),
                answer(AssessmentCategoryName.APTITUDE, 5)
        );

        assertThat(service.calculateTechnicalScore(answers)).isEqualTo(3.0);
    }

    @Test
    void calculatePersonalityMapsWeightedAverageToType() {
        List<AssessmentAnswer> answers = List.of(
                answer(AssessmentCategoryName.PERSONALITY, 5),
                answer(AssessmentCategoryName.PERSONALITY, 4)
        );

        assertThat(service.calculatePersonality(answers)).isEqualTo("Leader");
    }

    private AssessmentAnswer answer(AssessmentCategoryName categoryName, int score) {
        AssessmentCategory category = new AssessmentCategory();
        category.setName(categoryName);

        AssessmentQuestion question = new AssessmentQuestion();
        question.setCategory(category);

        AssessmentAnswer answer = new AssessmentAnswer();
        answer.setQuestion(question);
        answer.setScore(score);
        return answer;
    }
}
