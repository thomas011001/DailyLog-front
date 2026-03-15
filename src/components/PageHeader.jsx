export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl mb-2 text-center">{title}</h1>
      <p className="text-center text-sm opacity-80">{subtitle}</p>
    </div>
  );
}
