package com.careerguidance.mapper;

import com.careerguidance.dto.response.AssessmentAnswerResponse;
import com.careerguidance.dto.response.AssessmentCategoryResponse;
import com.careerguidance.dto.response.AssessmentOptionResponse;
import com.careerguidance.dto.response.AssessmentQuestionResponse;
import com.careerguidance.dto.response.AssessmentResultResponse;
import com.careerguidance.dto.response.AssessmentSessionResponse;
import com.careerguidance.entity.AssessmentAnswer;
import com.careerguidance.entity.AssessmentCategory;
import com.careerguidance.entity.AssessmentOption;
import com.careerguidance.entity.AssessmentQuestion;
import com.careerguidance.entity.AssessmentResult;
import com.careerguidance.entity.AssessmentSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AssessmentMapper {
    @Mapping(target = "name", expression = "java(category.getName().name())")
    AssessmentCategoryResponse toCategoryResponse(AssessmentCategory category);

    AssessmentOptionResponse toOptionResponse(AssessmentOption option);

    @Mapping(target = "questionType", expression = "java(question.getQuestionType().name())")
    AssessmentQuestionResponse toQuestionResponse(AssessmentQuestion question);

    @Mapping(target = "sessionId", source = "id")
    @Mapping(target = "status", expression = "java(session.getStatus().name())")
    AssessmentSessionResponse toSessionResponse(AssessmentSession session);

    @Mapping(target = "answerId", source = "id")
    @Mapping(target = "sessionId", source = "session.id")
    @Mapping(target = "questionId", source = "question.id")
    @Mapping(target = "optionId", source = "option.id")
    AssessmentAnswerResponse toAnswerResponse(AssessmentAnswer answer);

    @Mapping(target = "sessionId", source = "session.id")
    @Mapping(target = "strengths", ignore = true)
    @Mapping(target = "weaknesses", ignore = true)
    AssessmentResultResponse toResultResponse(AssessmentResult result);
}
