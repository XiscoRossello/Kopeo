import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 16, md: 24, lg: 40 }
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 size={sizes[size]} className="animate-spin text-primary" />
    </div>
  )
}
