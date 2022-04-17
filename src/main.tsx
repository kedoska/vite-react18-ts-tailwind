import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}
const root = createRoot(container)

interface FetchProps {
  url: string
}

interface FetchObject<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

const useFetch = <T,>(options: FetchProps) => {
  const [state, setState] = useState<FetchObject<T>>({
    data: undefined,
    loading: false,
    error: undefined,
  })

  const setLoading = () => setState({ ...state, loading: true })
  const setError = (error: Error) => setState({ ...state, loading: false, error })
  const setData = (data: T) => setState({ ...state, data, loading: false, error: undefined })

  const fetchData = async (url: string): Promise<T> => {
    const response = await fetch(url)
    const data = await response.json()
    return data as T
  }

  useEffect(() => {
    if (!options.url) {
      setError(new Error('No url provided'))
      return
    }

    setLoading()

    fetchData(options.url).then(setData).catch(setError)
  }, [options.url])

  return {
    ...state,
  }
}

const App = () => {
  const url = 'https://api.github.com/users/kedoska'

  interface GithubUser {
    name: string
    bio: string
  }

  const { data, loading, error } = useFetch<GithubUser>({ url })

  if (loading) {
    return <div>{`loading from ${url}`}</div>
  }

  if (error) {
    return <div>{`error: ${error.message}`}</div>
  }

  if (!data) {
    return <div>{`no data`}</div>
  }

  return (
    <div>
      <h1>{`${data.name}`}</h1>
      <p>{`${data.bio}`}</p>
    </div>
  )
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
