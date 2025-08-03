import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/LoginForm'
import { auth } from '@/lib/auth-wrapper'

export default async function LoginPage() {
  const session = await auth()
  
  if (session) {
    redirect('/admin')
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 py-6">
        <Link href="/" className="inline-block">
          <h1 className="text-2xl font-[family-name:var(--font-inria-serif-bold)]">
            Serpaý
          </h1>
        </Link>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
              Admin paneline giriň
            </h2>
            <p className="text-muted-foreground">
              Dowam etmek üçin maglumatlaryňyzy giriziň
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Baş sahypa dolan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}