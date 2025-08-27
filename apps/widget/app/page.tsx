import { Button } from "@workspace/ui/components/button"
import { add } from "@workspace/math/add"
import { Input } from "@workspace/ui/components/input"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello apps/widget</h1>
        <Button size="sm">Button</Button>
        {add(2,3)}
        <Input />
      </div>
    </div>
  )
}
