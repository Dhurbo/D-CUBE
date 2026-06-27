interface ErrorAlertProps {
  title: string
  errors: string[]
}

function ErrorAlert({ title, errors }: ErrorAlertProps) {
  if (errors.length === 0) {
    return null
  }

  return (
    <section className="rounded-lg border border-rose-800 bg-rose-950/50 p-4 text-rose-100" role="alert" aria-live="assertive">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
        {errors.map((error, index) => (
          <li key={`${error}-${index}`}>{error}</li>
        ))}
      </ul>
    </section>
  )
}

export default ErrorAlert
