import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCourses, createVideo, getUploadCredentials, getVideoStatus, linkVideoToBunny } from '@api/adminApi'

const STEP = { INFO: 1, UPLOAD: 2, DONE: 3 }

export default function VideoUploadPage() {
  const navigate  = useNavigate()
  const fileRef   = useRef(null)

  // Step
  const [step, setStep] = useState(STEP.INFO)

  // Step 1: form
  const [courses,  setCourses]  = useState([])
  const [form,     setForm]     = useState({ courseId: '', title: '', description: '', order: '' })
  const [creating, setCreating] = useState(false)
  const [formErr,  setFormErr]  = useState(null)

  // Step 2: upload
  const [videoId,    setVideoId]    = useState(null)
  const [creds,      setCreds]      = useState(null)  // { uploadUrl, bunnyVideoId }
  const [uploadMode, setUploadMode] = useState('new') // 'new' | 'link'
  const [file,       setFile]       = useState(null)
  const [progress,   setProgress]   = useState(0)
  const [uploading,  setUploading]  = useState(false)
  const [uploadErr,  setUploadErr]  = useState(null)
  const [linkId,     setLinkId]     = useState('')
  const [linking,    setLinking]    = useState(false)

  // Step 3: processing
  const [status,    setStatus]    = useState(null)
  const pollRef     = useRef(null)

  useEffect(() => {
    getAllCourses({ limit: 100 })
      .then(res => {
        const d = res.data.data
        setCourses(d?.courses || d || [])
      })
      .catch(() => {})
  }, [])

  // Stop polling on unmount
  useEffect(() => () => clearInterval(pollRef.current), [])

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  // ── Step 1: Create video slot ──
  const handleCreate = async (e) => {
    e.preventDefault()
    setFormErr(null)
    setCreating(true)
    try {
      const payload = {
        courseId:    form.courseId,
        title:       form.title,
        description: form.description,
        order:       form.order ? Number(form.order) : undefined,
      }
      const res  = await createVideo(payload)
      const data = res.data.data
      const newVideoId = data?.video?._id || data?._id
      if (!newVideoId) throw new Error('Video ID olinmadi')
      setVideoId(newVideoId)

      // Fetch upload credentials
      const credRes = await getUploadCredentials(newVideoId)
      setCreds(credRes.data.data)
      setStep(STEP.UPLOAD)
    } catch (e) {
      setFormErr(e.response?.data?.message || 'Xato yuz berdi')
    } finally {
      setCreating(false)
    }
  }

  // ── Step 2a: Link existing Bunny video ──
  const handleLink = async () => {
    if (!linkId.trim() || !videoId) return
    setUploadErr(null)
    setLinking(true)
    try {
      await linkVideoToBunny(videoId, linkId.trim())
      setStep(STEP.DONE)
      startPolling()
    } catch (e) {
      setUploadErr(e.response?.data?.message || 'Bog\'lashda xato yuz berdi')
    } finally {
      setLinking(false)
    }
  }

  // ── Step 2b: Upload file directly to Bunny ──
  const handleUpload = async () => {
    if (!file || !creds) return
    setUploadErr(null)
    setUploading(true)
    setProgress(0)

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', creds.uploadUrl, true)
        xhr.setRequestHeader('AccessKey', creds.accessKey || '')

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error(`Upload failed: ${xhr.status}`))
        })
        xhr.addEventListener('error', () => reject(new Error('Network error')))
        xhr.send(file)
      })

      setProgress(100)
      setStep(STEP.DONE)
      startPolling()
    } catch (e) {
      setUploadErr(e.message || 'Upload xatosi')
    } finally {
      setUploading(false)
    }
  }

  // ── Step 3: Poll status until ready or failed ──
  const startPolling = () => {
    if (!videoId) return
    setStatus('processing')

    pollRef.current = setInterval(async () => {
      try {
        const res  = await getVideoStatus(videoId)
        const data = res.data.data
        const s    = data?.bunnyStatus || 'processing'
        setStatus(s)
        if (s === 'ready' || s === 'failed') {
          clearInterval(pollRef.current)
        }
      } catch {
        // keep polling
      }
    }, 4000)
  }

  // ─────────────────────────────────────────────
  return (
    <div className="p-6 max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/videos')} className="btn btn-ghost btn-sm btn-square">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold">Video yuklash</h2>
          <p className="text-base-content/50 text-sm mt-0.5">Bunny.net Stream orqali</p>
        </div>
      </div>

      {/* Steps indicator */}
      <ul className="steps steps-horizontal w-full mb-8 text-xs">
        <li className={`step ${step >= STEP.INFO   ? 'step-primary' : ''}`}>Ma'lumotlar</li>
        <li className={`step ${step >= STEP.UPLOAD ? 'step-primary' : ''}`}>Yuklash</li>
        <li className={`step ${step >= STEP.DONE   ? 'step-primary' : ''}`}>Jarayon</li>
      </ul>

      {/* ── STEP 1: Info form ── */}
      {step === STEP.INFO && (
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-5">
            {formErr && <div className="alert alert-error mb-3"><span>{formErr}</span></div>}
            <form onSubmit={handleCreate} className="space-y-4">

              <div className="form-control">
                <label className="label py-1"><span className="label-text font-medium">Kurs *</span></label>
                <select
                  className="select select-bordered" required
                  value={form.courseId} onChange={set('courseId')}
                >
                  <option value="">— Kursni tanlang —</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text font-medium">Video nomi *</span></label>
                <input
                  className="input input-bordered" required
                  value={form.title} onChange={set('title')}
                  placeholder="masalan: 1-dars: O'zgaruvchilar"
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text font-medium">Tavsif</span></label>
                <textarea
                  className="textarea textarea-bordered h-20"
                  value={form.description} onChange={set('description')}
                  placeholder="Video haqida qisqacha..."
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Tartib raqami</span>
                  <span className="label-text-alt text-base-content/40">kurs ichidagi o'rni</span>
                </label>
                <input
                  type="number" min="1" className="input input-bordered w-28"
                  value={form.order} onChange={set('order')}
                  placeholder="1"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={creating}>
                {creating ? <span className="loading loading-spinner loading-sm" /> : null}
                Davom etish →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── STEP 2: File upload ── */}
      {step === STEP.UPLOAD && (
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-5 space-y-5">
            <div>
              <p className="font-semibold mb-1">{form.title}</p>
              <p className="text-xs text-base-content/40">Yangi Bunny slot ID: <code>{creds?.bunnyVideoId}</code></p>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed bg-base-300">
              <button
                className={`tab flex-1 ${uploadMode === 'new' ? 'tab-active' : ''}`}
                onClick={() => { setUploadMode('new'); setUploadErr(null) }}
              >📁 Yangi fayl yuklash</button>
              <button
                className={`tab flex-1 ${uploadMode === 'link' ? 'tab-active' : ''}`}
                onClick={() => { setUploadMode('link'); setUploadErr(null) }}
              >🔗 Mavjud Bunny ID bog'lash</button>
            </div>

            {uploadErr && <div className="alert alert-error"><span>{uploadErr}</span></div>}

            {/* ── Tab: Link existing Bunny video ── */}
            {uploadMode === 'link' && (
              <div className="space-y-4">
                <div className="alert bg-base-300 border-0 text-sm">
                  <span>Bunny.net dashboard dagi videoning <strong>Video ID</strong> sini kiriting (GUID formatida)</span>
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium">Bunny Video ID (GUID)</span>
                  </label>
                  <input
                    className="input input-bordered font-mono text-sm"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={linkId}
                    onChange={e => setLinkId(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleLink}
                  disabled={!linkId.trim() || linking}
                  className="btn btn-primary w-full"
                >
                  {linking
                    ? <><span className="loading loading-spinner loading-sm" /> Bog'lanmoqda…</>
                    : '🔗 Bunny videoni bog\'lash'}
                </button>
              </div>
            )}

            {/* ── Tab: Upload new file ── */}
            {uploadMode === 'new' && (
              <>
                {/* Drop zone */}
                <div
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
                    ${file ? 'border-primary bg-primary/5' : 'border-base-content/20 hover:border-primary/50'}`}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef} type="file" accept="video/*" className="hidden"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                  />
                  {file ? (
                    <div>
                      <p className="text-2xl mb-2">🎬</p>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-base-content/40 mt-1">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); setFile(null) }}
                        className="btn btn-ghost btn-xs mt-2 text-error"
                      >Olib tashlash</button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-4xl mb-3">📁</p>
                      <p className="font-medium">Faylni tanlang yoki bu yerga tashlang</p>
                      <p className="text-sm text-base-content/40 mt-1">MP4, MOV, AVI, MKV — maksimum 10 GB</p>
                    </div>
                  )}
                </div>

                {/* Progress */}
                {uploading && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Yuklanmoqda…</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <progress className="progress progress-primary w-full" value={progress} max="100" />
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="btn btn-primary w-full"
                >
                  {uploading
                    ? <><span className="loading loading-spinner loading-sm" /> {progress}% yuklanmoqda</>
                    : 'Bunny.net ga yuklash'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 3: Processing ── */}
      {step === STEP.DONE && (
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-8 text-center space-y-5">

            {status === 'ready' ? (
              <>
                <div className="text-6xl">✅</div>
                <h3 className="text-xl font-bold text-success">Video tayyor!</h3>
                <p className="text-base-content/60 text-sm">
                  Video muvaffaqiyatli yuklandi va Bunny.net tomonidan qayta ishlandi.
                </p>
              </>
            ) : status === 'failed' ? (
              <>
                <div className="text-6xl">❌</div>
                <h3 className="text-xl font-bold text-error">Xato yuz berdi</h3>
                <p className="text-base-content/60 text-sm">Video qayta ishlashda muammo. Qayta urinib ko'ring.</p>
              </>
            ) : (
              <>
                <div className="text-6xl">⏳</div>
                <h3 className="text-xl font-bold">Qayta ishlanmoqda…</h3>
                <p className="text-base-content/60 text-sm">
                  Bunny.net video qayta ishlamoqda. Bu biroz vaqt olishi mumkin.
                  <br />Sahifa avtomatik yangilanadi.
                </p>
                <span className="loading loading-dots loading-lg text-primary mx-auto" />
              </>
            )}

            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  clearInterval(pollRef.current)
                  setStep(STEP.INFO)
                  setForm({ courseId: form.courseId, title: '', description: '', order: '' })
                  setFile(null); setProgress(0); setVideoId(null); setCreds(null); setStatus(null)
                }}
                className="btn btn-ghost btn-sm"
              >
                Yana video yuklash
              </button>
              <button
                onClick={() => navigate('/admin/videos')}
                className="btn btn-primary btn-sm"
              >
                Videolar sahifasiga
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
