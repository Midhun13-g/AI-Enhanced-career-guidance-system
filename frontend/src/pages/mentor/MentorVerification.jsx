import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle,
  FiClock,
  FiShield,
  FiUploadCloud,
  FiTrash2,
  FiPlus,
  FiAlertCircle,
  FiArrowRight,
  FiArrowLeft,
  FiAward,
  FiBookOpen,
  FiCheck,
  FiUserCheck,
  FiFileText,
} from 'react-icons/fi';
import { mentorVerificationService as service } from '../../services/mentorVerificationService';

const steps = [
  'Personal Information',
  'Professional Details',
  'Social Profiles',
  'Documents',
  'Availability',
  'Declaration',
];

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  mobile: yup
    .string()
    .matches(/^\+?[0-9 ()-]{7,20}$/, 'Enter a valid mobile contact number')
    .required('Mobile contact is required'),
  dob: yup.string().required('Date of birth is required'),
  address: yup.string().required('Physical address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State/Province is required'),
  country: yup.string().required('Country is required'),
  company: yup.string().required('Current institution or organization is required'),
  jobTitle: yup.string().required('Professional role / title is required'),
  experience: yup
    .number()
    .typeError('Experience must be a number')
    .min(0, 'Experience cannot be negative')
    .required('Years of experience is required'),
  industry: yup.string().required('Primary industry domain is required'),
  bio: yup.string().max(500, 'Bio must not exceed 500 characters'),
  linkedin: yup.string().url('Enter a valid URL').nullable().transform((v) => v || null),
  github: yup.string().url('Enter a valid URL').nullable().transform((v) => v || null),
  portfolio: yup.string().url('Enter a valid URL').nullable().transform((v) => v || null),
  website: yup.string().url('Enter a valid URL').nullable().transform((v) => v || null),
  declaration: yup.boolean().oneOf([true], 'You must certify the submitted information'),
});

// Standardized Verification Status Badge
export function VerificationBadge({ status = 'PENDING' }) {
  const badgeConfig = {
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200/80',
    SUSPENDED: 'bg-rose-50 text-rose-700 border-rose-200/80',
    UNDER_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200/80',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200/80',
  }[status] || 'bg-neutral-100 text-neutral-700 border-neutral-200';

  const Icon = status === 'APPROVED' ? FiCheckCircle : FiClock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider border ${badgeConfig}`}
    >
      <Icon size={12} />
      <span>{status.replace('_', ' ')}</span>
    </span>
  );
}

// Standardized File Upload Container
function FileUploadBox({ label, required, onFile, file }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-200 bg-[#F8FAFC] p-4 space-y-3 transition-colors hover:border-neutral-300">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-mono">
          {label} {required && <span className="text-[#0038FF]">*</span>}
        </label>
        {file && (
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            Loaded
          </span>
        )}
      </div>

      {!file ? (
        <label className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 px-4 py-2.5 text-xs font-mono font-semibold text-neutral-800 cursor-pointer transition-all shadow-2xs">
          <FiUploadCloud size={14} className="text-[#0038FF]" />
          <span>Select Document (PDF/PNG/JPG)</span>
          <input
            hidden
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-2.5 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <FiFileText size={15} className="text-[#0038FF] shrink-0" />
            <span className="text-xs font-mono text-neutral-800 truncate">
              {file.name}
            </span>
            <span className="text-[10px] font-mono text-neutral-400 shrink-0">
              ({Math.ceil(file.size / 1024)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={() => onFile(null)}
            className="p-1 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            aria-label="Remove uploaded document"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── MENTOR REGISTRATION MULTI-STEP WIZARD ──────────────────────────
export function MentorRegistration() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [files, setFiles] = useState({});
  const [toast, setToast] = useState('');

  const {
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      skills: [],
      languages: [],
      availability: [{ day: 'Monday', start: '09:00', end: '17:00', mode: 'ONLINE' }],
      declaration: false,
    },
  });

  const slots = useFieldArray({ control, name: 'availability' });

  const fields = [
    ['fullName', 'email', 'mobile', 'dob', 'address', 'city', 'state', 'country'],
    ['company', 'jobTitle', 'experience', 'industry', 'bio'],
    ['linkedin', 'github', 'portfolio', 'website'],
    [],
    ['availability'],
    ['declaration'],
  ];

  const next = async () => {
    if (active === 3 && !files.resume) {
      setToast('A verified resume document (PDF) is required.');
      return;
    }
    const ok = await trigger(fields[active]);
    if (ok) setActive((a) => a + 1);
  };

  const submit = async (values) => {
    try {
      const uploaded = {};
      for (const [key, file] of Object.entries(files)) {
        if (file) uploaded[key] = await service.upload(file, key);
      }
      await service.register({ ...values, documents: uploaded });
      navigate('/mentor/status');
    } catch (e) {
      setToast(e.response?.data?.message || 'Unable to submit advisor accreditation application.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 antialiased selection:bg-[#0038FF] selection:text-white space-y-8">
      {/* Editorial Header */}
      <header className="border-b border-neutral-200/80 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
            Accreditation Protocol
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
            <FiShield size={9} /> Mentor Onboarding
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
          Apply as a Verified Academic Advisor
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
          Provide professional credentials and structured availability to mentor students across career and technical assessment pathways.
        </p>
      </header>

      {/* Stepper Indicator */}
      <div className="hidden md:grid grid-cols-6 gap-2">
        {steps.map((label, idx) => {
          const isDone = active > idx;
          const isCurrent = active === idx;
          return (
            <div
              key={label}
              className={`rounded-lg border p-3 space-y-1 transition-all ${
                isCurrent
                  ? 'border-[#0038FF] bg-blue-50/40'
                  : isDone
                  ? 'border-neutral-200 bg-white'
                  : 'border-neutral-100 bg-[#F8FAFC] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                <span className={isCurrent ? 'text-[#0038FF]' : 'text-neutral-400'}>
                  0{idx + 1}
                </span>
                {isDone && <FiCheck className="text-emerald-600" size={12} />}
              </div>
              <p
                className={`text-[11px] font-semibold truncate ${
                  isCurrent ? 'text-neutral-950' : 'text-neutral-600'
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          {/* Step 0: Personal Details */}
          {active === 0 && (
            <div className="space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Personal Information
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Legal identification details for background accreditation.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { id: 'fullName', label: 'Full Legal Name', type: 'text' },
                  { id: 'email', label: 'Institutional / Contact Email', type: 'email' },
                  { id: 'mobile', label: 'Phone Number', type: 'text' },
                  { id: 'dob', label: 'Date of Birth', type: 'date' },
                  { id: 'address', label: 'Street Address', type: 'text', span: true },
                  { id: 'city', label: 'City', type: 'text' },
                  { id: 'state', label: 'State / Province', type: 'text' },
                  { id: 'country', label: 'Country', type: 'text', span: true },
                ].map(({ id, label, type, span }) => (
                  <div key={id} className={span ? 'sm:col-span-2 space-y-1.5' : 'space-y-1.5'}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                      {label}
                    </label>
                    <input
                      type={type}
                      {...register(id)}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] transition-all font-mono"
                    />
                    {errors[id] && (
                      <p className="text-[11px] font-mono text-rose-600">{errors[id]?.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Professional Details */}
          {active === 1 && (
            <div className="space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Professional Profile & Background
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Current workplace experience and focus domains.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                    Company / Organization
                  </label>
                  <input
                    {...register('company')}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] font-mono"
                  />
                  {errors.company && (
                    <p className="text-[11px] font-mono text-rose-600">{errors.company?.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                    Current Job Title
                  </label>
                  <input
                    {...register('jobTitle')}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] font-mono"
                  />
                  {errors.jobTitle && (
                    <p className="text-[11px] font-mono text-rose-600">{errors.jobTitle?.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                    Total Experience (Years)
                  </label>
                  <input
                    type="number"
                    {...register('experience')}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] font-mono"
                  />
                  {errors.experience && (
                    <p className="text-[11px] font-mono text-rose-600">{errors.experience?.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                    Primary Domain / Industry
                  </label>
                  <input
                    {...register('industry')}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] font-mono"
                  />
                  {errors.industry && (
                    <p className="text-[11px] font-mono text-rose-600">{errors.industry?.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                    Professional Biography (Max 500 characters)
                  </label>
                  <textarea
                    rows={4}
                    {...register('bio')}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] resize-none"
                    placeholder="Describe your mentorship philosophy and core competencies..."
                  />
                  {errors.bio && (
                    <p className="text-[11px] font-mono text-rose-600">{errors.bio?.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Social Profiles */}
          {active === 2 && (
            <div className="space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Online Presence & Portfolios
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Provide verifiable digital presence links for candidate vetting.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { id: 'linkedin', label: 'LinkedIn Profile URL' },
                  { id: 'github', label: 'GitHub Profile URL' },
                  { id: 'portfolio', label: 'Portfolio URL' },
                  { id: 'website', label: 'Personal Website / Lab URL' },
                ].map(({ id, label }) => (
                  <div key={id} className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                      {label}
                    </label>
                    <input
                      type="url"
                      placeholder="https://"
                      {...register(id)}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] font-mono"
                    />
                    {errors[id] && (
                      <p className="text-[11px] font-mono text-rose-600">{errors[id]?.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Verification Documents */}
          {active === 3 && (
            <div className="space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Identity & Accreditation Assets
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Uploaded files must not exceed 10MB each (PDF, JPG, PNG).
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['resume', 'Curriculum Vitae / Resume (PDF)', true],
                  ['degree', 'Highest Degree Certificate', false],
                  ['governmentId', 'Government Identity Document', false],
                  ['experienceCertificate', 'Experience Certificate', false],
                  ['employeeId', 'Institutional Employee ID', false],
                ].map(([k, l, r]) => (
                  <FileUploadBox
                    key={k}
                    label={l}
                    required={r}
                    file={files[k]}
                    onFile={(f) => {
                      if (f && f.size > 10 * 1024 * 1024) {
                        setToast('Files must not exceed 10MB');
                        return;
                      }
                      setFiles((x) => ({ ...x, [k]: f }));
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Availability Slots */}
          {active === 4 && (
            <div className="space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Weekly Mentorship Schedule
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Configure recurring windows for student advisory sessions.
                </p>
              </div>

              <div className="space-y-3">
                {slots.fields.map((f, i) => (
                  <div
                    key={f.id}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end rounded-xl border border-neutral-200 bg-[#F8FAFC] p-3"
                  >
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                        Day of Week
                      </label>
                      <input
                        {...register(`availability.${i}.day`)}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                        Start Time
                      </label>
                      <input
                        type="time"
                        {...register(`availability.${i}.start`)}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                        End Time
                      </label>
                      <input
                        type="time"
                        {...register(`availability.${i}.end`)}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                          Format
                        </label>
                        <Controller
                          control={control}
                          name={`availability.${i}.mode`}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-mono"
                            >
                              <option value="ONLINE">Online</option>
                              <option value="OFFLINE">Offline</option>
                              <option value="HYBRID">Hybrid</option>
                            </select>
                          )}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => slots.remove(i)}
                        disabled={slots.fields.length === 1}
                        className="h-9 w-9 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-400 hover:text-rose-600 hover:border-rose-200 transition-colors disabled:opacity-40"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  slots.append({ day: 'Monday', start: '09:00', end: '17:00', mode: 'ONLINE' })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 px-3.5 py-2 text-xs font-mono font-semibold transition-all shadow-2xs"
              >
                <FiPlus size={13} />
                <span>Add Time Block</span>
              </button>
            </div>
          )}

          {/* Step 5: Declaration */}
          {active === 5 && (
            <div className="space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Formal Certification & Declaration
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Confirm the accuracy and truthfulness of your submission.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-[#F8FAFC] p-4 text-xs text-neutral-600 leading-relaxed space-y-2">
                <p>
                  By certifying this form, you verify that all details, certifications, and attached credentials are authentic, current, and representative of your professional background.
                </p>
                <p>
                  Misrepresentation may result in permanent revocation of platform advisory privileges.
                </p>
              </div>

              <Controller
                control={control}
                name="declaration"
                render={({ field }) => (
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-[#0038FF] focus:ring-[#0038FF]"
                    />
                    <span className="text-xs font-semibold text-neutral-900 leading-snug">
                      I certify that all submitted information and supporting accreditation documents are true, complete, and accurate.
                    </span>
                  </label>
                )}
              />
              {errors.declaration && (
                <p className="text-[11px] font-mono text-rose-600">
                  {errors.declaration?.message}
                </p>
              )}
            </div>
          )}

          {/* Wizard Action Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
            <button
              type="button"
              disabled={active === 0}
              onClick={() => setActive((a) => a - 1)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 px-4 py-2.5 text-xs font-mono font-semibold text-neutral-700 transition-all disabled:opacity-40"
            >
              <FiArrowLeft size={13} />
              <span>Previous</span>
            </button>

            {active === 5 ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-mono font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                <FiUserCheck size={13} />
                <span>{isSubmitting ? 'Transmitting...' : 'Submit Application'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-mono font-semibold shadow-md shadow-blue-500/20 transition-all"
              >
                <span>Continue</span>
                <FiArrowRight size={13} />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 right-6 z-50 rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-xl text-xs font-mono text-rose-800 flex items-center gap-3"
          >
            <FiAlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{toast}</span>
            <button
              onClick={() => setToast('')}
              className="text-rose-500 hover:text-rose-800 font-bold ml-2"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MENTOR ACCREDITATION STATUS VIEW ───────────────────────────────
export function MentorStatus() {
  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    service
      .me()
      .then(setMentor)
      .catch(() => setMentor({ status: 'PENDING' }));
  }, []);

  if (!mentor) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-3 antialiased">
        <FiClock size={24} className="mx-auto text-neutral-400 animate-spin" />
        <p className="text-xs font-mono text-neutral-500">
          Querying accreditation verification status...
        </p>
      </div>
    );
  }

  const status = mentor.status || 'PENDING';
  const messages = {
    PENDING: 'Your application is queued for administrative accreditation review.',
    UNDER_REVIEW: 'The accreditation audit committee is examining your credentials.',
    APPROVED: 'Your credentials have been verified. Your advisory workspace is active.',
    REJECTED: 'Remediation is required before verification can be finalized.',
    SUSPENDED: 'Your advisory profile has been temporarily suspended by system governance.',
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 antialiased selection:bg-[#0038FF] selection:text-white">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-xs text-center space-y-6">
        <div
          className={`h-14 w-14 mx-auto rounded-2xl flex items-center justify-center border ${
            status === 'APPROVED'
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-amber-50 text-amber-600 border-amber-200'
          }`}
        >
          {status === 'APPROVED' ? <FiCheckCircle size={26} /> : <FiClock size={26} />}
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
            Accreditation Telemetry
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-950">Verification Status</h1>
          <div className="pt-1">
            <VerificationBadge status={status} />
          </div>
        </div>

        <p className="text-xs text-neutral-500 font-mono max-w-md mx-auto leading-relaxed">
          {messages[status]}
        </p>

        {mentor.rejectionReason && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-left text-xs font-mono text-rose-800 space-y-1">
            <p className="font-bold uppercase tracking-wider text-rose-900">Audit Remarks:</p>
            <p>{mentor.rejectionReason}</p>
          </div>
        )}

        {/* Milestone Steps */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-100">
          {[
            { label: 'Submitted', done: true },
            { label: 'Under Review', done: status !== 'PENDING' },
            { label: 'Accredited', done: status === 'APPROVED' },
          ].map((step, idx) => (
            <div key={step.label} className="space-y-1">
              <div
                className={`h-1.5 w-full rounded-full ${
                  step.done ? 'bg-[#0038FF]' : 'bg-neutral-100'
                }`}
              />
              <p className="text-[10px] font-mono font-bold uppercase text-neutral-400 mt-1">
                {step.label}
              </p>
            </div>
          ))}
        </div>

        {status === 'REJECTED' && (
          <div className="pt-2">
            <Link
              to="/mentor/register"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-mono font-semibold shadow-md shadow-blue-500/20 transition-all"
            >
              <FiUploadCloud size={13} />
              <span>Resubmit Accreditation Files</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ── BECOME A MENTOR LANDING VIEW ───────────────────────────────────
export function BecomeMentor() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 antialiased selection:bg-[#0038FF] selection:text-white space-y-10">
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[#0038FF] text-[10px] font-bold font-mono uppercase">
          <FiShield size={10} /> Faculty & Industry Network
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
          Supervise Candidate Trajectories
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          Join our verified network of industry practitioners guiding student candidates across skills benchmarking and career pathways.
        </p>
        <div className="pt-2">
          <Link
            to="/mentor/register"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-5 py-3 text-xs font-mono font-semibold shadow-md shadow-blue-500/20 transition-all"
          >
            <span>Begin Accreditation Application</span>
            <FiArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3 pt-4 border-t border-neutral-200/80">
        {[
          {
            icon: FiBookOpen,
            title: 'Diagnostic Supervision',
            desc: 'Review candidate code submissions, quantitative diagnostic outputs, and ATS profiles.',
          },
          {
            icon: FiShield,
            title: 'Structured Accreditation',
            desc: 'Secure verification pipeline authenticating practitioner background and expertise.',
          },
          {
            icon: FiAward,
            title: 'Academic Impact',
            desc: 'Empower university students with structured interventions and curriculum guidance.',
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-3"
          >
            <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
              <Icon size={16} />
            </div>
            <h3 className="text-sm font-bold text-neutral-950">{title}</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}