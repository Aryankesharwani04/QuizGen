import { useState } from 'react';
export default function SimpleForm({
  fields,
  onSubmit,
  loading = false,
  error = null,
  success = null,
  buttonText = 'Submit',
  footerText = null,
}) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit(formData);
    
    // If there are field-specific errors, show them
    if (result?.errors) {
      setFieldErrors(result.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-ocean-green border border-accent rounded-lg">
          <p className="text-sm text-bg-dark">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="p-4 bg-accent-light border border-accent rounded-lg">
          <p className="text-sm text-text-primary">{success}</p>
        </div>
      )}

      {/* Form Fields */}
      {fields.map(field => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-text-primary mb-1"
          >
            {field.label || field.name.charAt(0).toUpperCase() + field.name.slice(1)}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              disabled={loading}
              rows={field.rows || 4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-accent-light ${
                fieldErrors[field.name] ? 'border-ocean-green' : 'border-accent'
              }`}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-accent-light ${
                fieldErrors[field.name] ? 'border-ocean-green' : 'border-accent'
              }`}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              disabled={loading}
              required={field.required}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-accent-light ${
                fieldErrors[field.name] ? 'border-ocean-green' : 'border-accent'
              }`}
            />
          )}
          {fieldErrors[field.name] && (
            <p className="text-xs text-ocean-green mt-1">{fieldErrors[field.name]}</p>
          )}
        </div>
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-primary text-text-on-dark rounded-lg hover:bg-primary-dark disabled:bg-accent-light transition font-medium"
      >
        {loading ? 'Processing...' : buttonText}
      </button>

      {/* Footer Text */}
      {footerText && (
        <p className="text-center text-sm text-primary-dark">
          {footerText}
        </p>
      )}
    </form>
  );
}
