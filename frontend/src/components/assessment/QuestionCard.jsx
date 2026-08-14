import { Controller, useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import OptionCard from './OptionCard';

export default function QuestionCard({ question, answer, onAnswer }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors?.answers?.[question.id]?.message;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.22 }}
      className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="mb-5">
        {question.category && <p className="mb-2 text-xs font-bold uppercase tracking-wide text-sky-600">{question.category}</p>}
        <h2 className="text-lg font-bold leading-7 text-slate-950 sm:text-xl">{question.title}</h2>
      </div>

      <Controller
        control={control}
        name={`answers.${question.id}`}
        rules={{
          validate: (value) => {
            if (!question.required) return true;
            if (question.type === 'multi') return (Array.isArray(value) && value.length >= (question.minSelections || 1)) || `Choose at least ${question.minSelections || 1} interests.`;
            return value !== undefined && value !== '' || 'This question is required.';
          },
        }}
        render={({ field }) => {
          const update = (value) => {
            field.onChange(value);
            onAnswer(question.id, value);
          };

          if (question.type === 'multi') {
            const selected = Array.isArray(field.value || answer) ? (field.value || answer) : [];
            return (
              <div className="grid gap-3 sm:grid-cols-2">
                {question.options.map((option) => (
                  <OptionCard
                    key={option}
                    label={option}
                    selected={selected.includes(option)}
                    onSelect={() => update(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])}
                  />
                ))}
              </div>
            );
          }

          return (
            <div className="grid gap-3">
              {question.options.map((option) => {
                const value = typeof option === 'object' ? option.value : option;
                const label = typeof option === 'object' ? option.label : option;
                return (
                  <OptionCard
                    key={value}
                    label={label}
                    description={question.type === 'rating' ? `${value} out of 5` : undefined}
                    selected={field.value === value || answer === value}
                    onSelect={() => update(value)}
                  />
                );
              })}
            </div>
          );
        }}
      />

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>}
    </motion.div>
  );
}
