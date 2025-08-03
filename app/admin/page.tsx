import Link from 'next/link'
import { Users, BookOpen, UserCog, ArrowRight, Activity } from 'lucide-react'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem, Editor } from '@/lib/db/models'

export const dynamic = 'force-dynamic'

async function getStats() {
  await dbConnect()
  
  const [poetCount, poemCount, editorCount] = await Promise.all([
    Poet.countDocuments({ is_deleted: { $ne: true } }),
    Poem.countDocuments({ is_deleted: { $ne: true } }),
    Editor.countDocuments({ is_deleted: { $ne: true } })
  ])
  
  // Get recent activity
  const recentPoems = await Poem.find({ is_deleted: { $ne: true } })
    .sort({ created_at: -1 })
    .limit(5)
    .populate('author', 'fullname')
    .lean()
  
  return {
    stats: {
      poets: poetCount,
      poems: poemCount,
      editors: editorCount
    },
    recentPoems: recentPoems.map(poem => ({
      id: poem._id.toString(),
      title: poem.title,
      author: (poem.author && typeof poem.author === 'object' && 'fullname' in poem.author) 
        ? String(poem.author.fullname) 
        : 'Näbelli',
      date: poem.created_at
    }))
  }
}

export default async function AdminDashboard() {
  const { stats, recentPoems } = await getStats()
  
  const cards = [
    {
      title: 'Şahyrlar',
      count: stats.poets,
      icon: Users,
      href: '/admin/poets',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Goşgular',
      count: stats.poems,
      icon: BookOpen,
      href: '/admin/poems',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Redaktorlar',
      count: stats.editors,
      icon: UserCog,
      href: '/admin/editors',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground mt-2">Serpaý platformasyny dolandyryň</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold">{card.count}</p>
                </div>
                <div className={`rounded-xl p-3 ${card.bgColor} ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Activity className="h-6 w-6 text-muted-foreground" />
            Soňky goşulan goşgular
          </h2>
          <Link 
            href="/admin/poems" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Hemmesini gör →
          </Link>
        </div>
        
        <div className="rounded-xl border bg-card">
          <div className="divide-y">
            {recentPoems.length > 0 ? (
              recentPoems.map((poem) => (
                <div key={poem.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{poem.title}</p>
                    <p className="text-sm text-muted-foreground">{poem.author}</p>
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {new Date(poem.date).toLocaleDateString('tk-TM')}
                  </time>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                Soňky goşulan goşgy ýok
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <h3 className="text-lg font-semibold mb-4">Çalt amallar</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/admin/poets/new"
            className="flex items-center gap-3 rounded-lg bg-background/80 backdrop-blur p-4 hover:bg-background transition-colors"
          >
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Täze şahyr goş</span>
          </Link>
          <Link
            href="/admin/poems/new"
            className="flex items-center gap-3 rounded-lg bg-background/80 backdrop-blur p-4 hover:bg-background transition-colors"
          >
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Täze goşgy goş</span>
          </Link>
          <Link
            href="/admin/editors/new"
            className="flex items-center gap-3 rounded-lg bg-background/80 backdrop-blur p-4 hover:bg-background transition-colors"
          >
            <UserCog className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Täze redaktor goş</span>
          </Link>
        </div>
      </div>
    </div>
  )
}