import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  MapPin,
  Send,
  Upload,
} from "lucide-react";

const categories = [
  "IT & Network",
  "Electrical",
  "Classroom Equipment",
  "Building & Furniture",
  "Cleaning & Sanitation",
  "Water & Plumbing",
  "Laboratory Equipment",
  "Other",
];

const urgencyLevels = [
  {
    value: "LOW",
    label: "Low",
    description: "Issue has little or no immediate impact.",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    description: "Issue affects normal activities but has a workaround.",
  },
  {
    value: "HIGH",
    label: "High",
    description: "Issue significantly affects learning or campus activities.",
  },
];

function NewRequestPage() {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    urgency: "MEDIUM",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Please enter a request title.";
    }

    if (!form.category) {
      nextErrors.category = "Please select a service category.";
    }

    if (!form.location.trim()) {
      nextErrors.location = "Please enter the location.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Please describe the issue.";
    } else if (form.description.trim().length < 20) {
      nextErrors.description =
        "Please provide at least 20 characters describing the issue.";
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={34} />
          </div>

          <p className="mt-6 text-sm font-semibold text-emerald-600">
            Request Submitted
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Your service request has been received.
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-slate-500">
            Your request has been recorded successfully. The relevant campus
            service team can review and process it.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Request Reference
            </p>
            <p className="mt-2 text-lg font-bold text-slate-900">
            USR-1001
             </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/student/requests"
              className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              View My Requests
            </Link>

            <Link
              to="/student/dashboard"
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold text-blue-700">
            Service Request
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Report a Campus Issue
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Provide the details below so the appropriate university service
            team can review and resolve your issue.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Basic information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <FileText size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Request Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tell us what needs attention.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Request Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Projector not working in Lecture Hall 03"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                  errors.title
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />

              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Category + Location */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Service Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                    errors.category
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {errors.category && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Faculty of Engineering, Lab 02"
                    className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-4 ${
                      errors.location
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                </div>

                {errors.location && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Issue Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="6"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what happened, when you noticed it, and any other useful details..."
                className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />

              <div className="mt-2 flex justify-between gap-4">
                {errors.description ? (
                  <p className="text-sm text-red-600">{errors.description}</p>
                ) : (
                  <p className="text-xs text-slate-400">
                    Include useful information that can help the service team.
                  </p>
                )}

                <span className="shrink-0 text-xs text-slate-400">
                  {form.description.length} characters
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Priority */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Urgency & Impact
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select the option that best describes the impact of this issue.
              Final priority can be reviewed by the administrator.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {urgencyLevels.map((level) => {
              const selected = form.urgency === level.value;

              return (
                <label
                  key={level.value}
                  className={`cursor-pointer rounded-2xl border p-5 transition ${
                    selected
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={level.value}
                    checked={selected}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3">
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${
                        selected
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-300"
                      }`}
                    />

                    <span className="font-semibold text-slate-900">
                      {level.label}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {level.description}
                  </p>
                </label>
              );
            })}
          </div>
        </section>

        {/* Attachment placeholder */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
              <Upload size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Supporting Evidence
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Attach photos or documents that may help explain the issue.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <Upload className="mx-auto text-slate-400" size={28} />

            <p className="mt-3 font-semibold text-slate-700">
              File upload will be available soon
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Attachments will be connected to backend storage later.
            </p>
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/student/dashboard"
            className="rounded-xl border border-slate-200 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            <Send size={18} />
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewRequestPage;