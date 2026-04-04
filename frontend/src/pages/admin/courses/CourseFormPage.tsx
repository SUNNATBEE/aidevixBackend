import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { getCourseById, createCourse, updateCourse } from '@api/adminApi'
import { CATEGORIES } from '@utils/constants'

const LEVELS = [
  { value: 'beginner',     label: 'Boshlang\'ich' },
  { value: 'intermediate', label: 'O\'rta' },
  { value: 'advanced',     label: 'Murakkab' },
]

const EMPTY = {
  title: '', description: '', shortDescription: '',
  category: 'javascript', level: 'beginner',
  price: '', thumbnail: '', language: 'uz',
  tags: '', prerequisites: '', outcomes: '',
}

export default function CourseFormPage() {
  const router = useRouter()
  const { id } = router.query
  const isEdit = Boolean(id)

  const [form,    setForm]    = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!isEdit || !id) return
    setLoading(true)
    getCourseById(id as string)
      .then(res => {
        const c = res.data.data
        setForm({
          title:            c.title            || '',
          description:      c.description      || '',
          shortDescription: c.shortDescription || '',
          category:         c.category         || 'javascript',
          level:            c.level            || 'beginner',
          price:            c.price            ?? '',
          thumbnail:        c.thumbnail        || '',
          language:         c.language         || 'uz',
          tags:             Array.isArray(c.tags) ? c.tags.join(', ') : (c.tags || ''),
          prerequisites:    Array.isArray(c.prerequisites) ? c.prerequisites.join('\n') : (c.prerequisites || ''),
          outcomes:         Array.isArray(c.outcomes) ? c.outcomes.join('\n') : (c.outcomes || ''),
        })
      })
      .catch(() => setError('Kurs topilmadi'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (field: string) => (e: any) => setForm(p => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        ...form,
        price:         form.price === '' ? 0 : Number(form.price),
        tags:          form.tags.split(',').map(s => s.trim()).filter(Boolean),
        prerequisites: form.prerequisites.split('\n').map(s => s.trim()).filter(Boolean),
        outcomes:      form.outcomes.split('\n').map(s => s.trim()).filter(Boolean),
      }
      if (isEdit && id) {
        await updateCourse(id as string, payload)
      } else {
        await createCourse(payload)
      }
      router.push('/admin/courses')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Xato yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  )

  return (
    <div className="p-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/admin/courses')} className="btn btn-ghost btn-sm btn-square">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold">{isEdit ? 'Kursni tahrirlash' : 'Yangi kurs'}</h2>
          {isEdit && <p className="text-sm text-base-content/50 mt-0.5">ID: {id}</p>}
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4"><span>{error}</span></div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Main info */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-5 space-y-4">
            <h3 className="font-semibold text-base-content/70 text-sm uppercase tracking-wider">Asosiy ma'lumotlar</h3>

            <div className="form-control">
              <label className="label py-1"><span className="label-text font-medium">Kurs nomi *</span></label>
              <input
                className="input input-bordered" required
                value={form.title} onChange={set('title')}
                placeholder="masalan: JavaScript asoslari"
              />
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text font-medium">Qisqa tavsif</span></label>
              <input
                className="input input-bordered"
                value={form.shortDescription} onChange={set('shortDescription')}
                placeholder="Kurs haqida 1-2 jumlada..."
              />
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text font-medium">To'liq tavsif</span></label>
              <textarea
                className="textarea textarea-bordered h-28"
                value={form.description} onChange={set('description')}
                placeholder="Kurs haqida batafsil..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1"><span className="label-text font-medium">Kategoriya *</span></label>
                <select className="select select-bordered" value={form.category} onChange={set('category')}>
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label py-1"><span className="label-text font-medium">Daraja *</span></label>
                <select className="select select-bordered" value={form.level} onChange={set('level')}>
                  {LEVELS.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1"><span className="label-text font-medium">Narx (UZS)</span></label>
                <input
                  type="number" min="0" className="input input-bordered"
                  value={form.price} onChange={set('price')}
                  placeholder="0 = bepul"
                />
              </div>
              <div className="form-control">
                <label className="label py-1"><span className="label-text font-medium">Til</span></label>
                <select className="select select-bordered" value={form.language} onChange={set('language')}>
                  <option value="uz">O'zbek</option>
                  <option value="ru">Rus</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-5 space-y-4">
            <h3 className="font-semibold text-base-content/70 text-sm uppercase tracking-wider">Media</h3>
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-medium">Thumbnail URL</span></label>
              <input
                className="input input-bordered"
                value={form.thumbnail} onChange={set('thumbnail')}
                placeholder="https://..."
              />
            </div>
            {form.thumbnail && (
              <img src={form.thumbnail} alt="preview" className="h-28 w-auto object-cover rounded-lg border border-base-300" />
            )}
          </div>
        </div>

        {/* Additional */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-5 space-y-4">
            <h3 className="font-semibold text-base-content/70 text-sm uppercase tracking-wider">Qo'shimcha</h3>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Teglar</span>
                <span className="label-text-alt text-base-content/40">vergul bilan ajrating</span>
              </label>
              <input
                className="input input-bordered"
                value={form.tags} onChange={set('tags')}
                placeholder="frontend, web, html"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Talablar (prerequisites)</span>
                <span className="label-text-alt text-base-content/40">har biri yangi qatorda</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-20"
                value={form.prerequisites} onChange={set('prerequisites')}
                placeholder="HTML asoslari&#10;CSS bilimi"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Kurs natijalari (outcomes)</span>
                <span className="label-text-alt text-base-content/40">har biri yangi qatorda</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-20"
                value={form.outcomes} onChange={set('outcomes')}
                placeholder="JavaScript asoslarini o'rganasilz&#10;DOM bilan ishlashni bilasiz"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <span className="loading loading-spinner loading-sm" /> : null}
            {isEdit ? 'Saqlash' : 'Yaratish'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => router.push('/admin/courses')}>
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
  )
}
