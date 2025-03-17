'use client'

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
export default function Main() {

  function alt () {
    alert("Hello world")
  }
  return (
    <div className="flex items-center justify-center">
      <Button size="icon" onClick={alt}>
        <Home />
      </Button>
    </div>
  );
}