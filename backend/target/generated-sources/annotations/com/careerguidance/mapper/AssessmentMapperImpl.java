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
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-30T09:33:38+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class AssessmentMapperImpl implements AssessmentMapper {

    @Override
    public AssessmentCategoryResponse toCategoryResponse(AssessmentCategory category) {
        if ( category == null ) {
            return null;
        }

        AssessmentCategoryResponse assessmentCategoryResponse = new AssessmentCategoryResponse();

        assessmentCategoryResponse.setId( category.getId() );
        assessmentCategoryResponse.setDescription( category.getDescription() );

        assessmentCategoryResponse.setName( category.getName().name() );

        return assessmentCategoryResponse;
    }

    @Override
    public AssessmentOptionResponse toOptionResponse(AssessmentOption option) {
        if ( option == null ) {
            return null;
        }

        AssessmentOptionResponse assessmentOptionResponse = new AssessmentOptionResponse();

        assessmentOptionResponse.setId( option.getId() );
        assessmentOptionResponse.setOptionText( option.getOptionText() );
        assessmentOptionResponse.setDisplayOrder( option.getDisplayOrder() );

        return assessmentOptionResponse;
    }

    @Override
    public AssessmentQuestionResponse toQuestionResponse(AssessmentQuestion question) {
        if ( question == null ) {
            return null;
        }

        AssessmentQuestionResponse assessmentQuestionResponse = new AssessmentQuestionResponse();

        assessmentQuestionResponse.setId( question.getId() );
        assessmentQuestionResponse.setQuestion( question.getQuestion() );
        assessmentQuestionResponse.setDifficulty( question.getDifficulty() );
        assessmentQuestionResponse.setDisplayOrder( question.getDisplayOrder() );
        assessmentQuestionResponse.setOptions( assessmentOptionListToAssessmentOptionResponseList( question.getOptions() ) );

        assessmentQuestionResponse.setQuestionType( question.getQuestionType().name() );

        return assessmentQuestionResponse;
    }

    @Override
    public AssessmentSessionResponse toSessionResponse(AssessmentSession session) {
        if ( session == null ) {
            return null;
        }

        AssessmentSessionResponse assessmentSessionResponse = new AssessmentSessionResponse();

        assessmentSessionResponse.setSessionId( session.getId() );
        assessmentSessionResponse.setStartedAt( session.getStartedAt() );
        assessmentSessionResponse.setCompletedAt( session.getCompletedAt() );

        assessmentSessionResponse.setStatus( session.getStatus().name() );

        return assessmentSessionResponse;
    }

    @Override
    public AssessmentAnswerResponse toAnswerResponse(AssessmentAnswer answer) {
        if ( answer == null ) {
            return null;
        }

        AssessmentAnswerResponse assessmentAnswerResponse = new AssessmentAnswerResponse();

        assessmentAnswerResponse.setAnswerId( answer.getId() );
        assessmentAnswerResponse.setSessionId( answerSessionId( answer ) );
        assessmentAnswerResponse.setQuestionId( answerQuestionId( answer ) );
        assessmentAnswerResponse.setOptionId( answerOptionId( answer ) );
        assessmentAnswerResponse.setScore( answer.getScore() );

        return assessmentAnswerResponse;
    }

    @Override
    public AssessmentResultResponse toResultResponse(AssessmentResult result) {
        if ( result == null ) {
            return null;
        }

        AssessmentResultResponse assessmentResultResponse = new AssessmentResultResponse();

        assessmentResultResponse.setSessionId( resultSessionId( result ) );
        assessmentResultResponse.setTechnicalScore( result.getTechnicalScore() );
        assessmentResultResponse.setAptitudeScore( result.getAptitudeScore() );
        assessmentResultResponse.setPersonalityScore( result.getPersonalityScore() );
        assessmentResultResponse.setInterestScore( result.getInterestScore() );
        assessmentResultResponse.setOverallScore( result.getOverallScore() );
        assessmentResultResponse.setPersonalityType( result.getPersonalityType() );
        assessmentResultResponse.setRecommendedCategory( result.getRecommendedCategory() );

        return assessmentResultResponse;
    }

    protected List<AssessmentOptionResponse> assessmentOptionListToAssessmentOptionResponseList(List<AssessmentOption> list) {
        if ( list == null ) {
            return null;
        }

        List<AssessmentOptionResponse> list1 = new ArrayList<AssessmentOptionResponse>( list.size() );
        for ( AssessmentOption assessmentOption : list ) {
            list1.add( toOptionResponse( assessmentOption ) );
        }

        return list1;
    }

    private Long answerSessionId(AssessmentAnswer assessmentAnswer) {
        if ( assessmentAnswer == null ) {
            return null;
        }
        AssessmentSession session = assessmentAnswer.getSession();
        if ( session == null ) {
            return null;
        }
        Long id = session.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long answerQuestionId(AssessmentAnswer assessmentAnswer) {
        if ( assessmentAnswer == null ) {
            return null;
        }
        AssessmentQuestion question = assessmentAnswer.getQuestion();
        if ( question == null ) {
            return null;
        }
        Long id = question.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long answerOptionId(AssessmentAnswer assessmentAnswer) {
        if ( assessmentAnswer == null ) {
            return null;
        }
        AssessmentOption option = assessmentAnswer.getOption();
        if ( option == null ) {
            return null;
        }
        Long id = option.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long resultSessionId(AssessmentResult assessmentResult) {
        if ( assessmentResult == null ) {
            return null;
        }
        AssessmentSession session = assessmentResult.getSession();
        if ( session == null ) {
            return null;
        }
        Long id = session.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
