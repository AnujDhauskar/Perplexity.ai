import { RouterProvider } from "react-router-dom"
import { router } from "./app.routes"
import { useAuth } from "../features/auth/hook/useAuth"
import { useEffect } from "react"


function App() {

  const { handleGetMe, hydrateUserFromStorage } = useAuth()

  useEffect(() => {
    hydrateUserFromStorage()
    handleGetMe()
  }, [handleGetMe, hydrateUserFromStorage])

  return (
    <RouterProvider router={router} />
  )
}

export default App
