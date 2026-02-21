type ContentHeaderProps = {
  title: string
}

const ContentHeader = ({ title }: ContentHeaderProps) => (
  <header className="px-24 pt-6">
    <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
  </header>
)

export default ContentHeader
