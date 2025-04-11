
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI 攻略",
  description: "AI 攻略",
}

export default function CreatePlanLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
}
