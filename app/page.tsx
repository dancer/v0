"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUp, Paperclip, Plus, Sparkles } from 'lucide-react'
import Link from "next/link"
import Image from 'next/image'

function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 left-1/2 z-0 flex size-full max-w-screen-2xl -translate-x-1/2 items-center justify-center">
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes pathAnimation {
          0% { stroke-dashoffset: 1000; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes pulseAnimation {
          0% { transform: scale(0.95); opacity: 0; }
          50% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .animate-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: pathAnimation 8s linear infinite;
        }
        .animate-pulse-custom {
          animation: pulseAnimation 4s ease-in-out infinite;
        }
        .animate-fade-loop {
          animation: fadeIn 6s ease-in-out infinite;
        }
        @keyframes ellipsis {
          0% { content: ""; }
          25% { content: "."; }
          50% { content: ".."; }
          75% { content: "..."; }
          100% { content: ""; }
        }

        .thinking-dots::after {
          content: "";
          display: inline-block;
          width: 12px;
          animation: ellipsis 1.5s infinite steps(1);
        }
      `}</style>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute"
        fill="none"
        height="610"
        viewBox="0 0 1283 610"
        width="1283"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="pulseGradient">
            <stop offset="10%" stopColor="#58F0D4" />
            <stop offset="95%" stopColor="#58F0D400" />
          </radialGradient>
          <linearGradient gradientTransform="rotate(90)" id="fadeGradient">
            <stop offset="0%" stopColor="#888888" stopOpacity="0" />
            <stop offset="50%" stopColor="white" />
            <stop offset="100%" stopColor="#888888" stopOpacity="0" />
          </linearGradient>
          <mask id="vignette">
            <rect fill="url('#fadeGradient')" height="610" width="1283" x="0" y="0" />
          </mask>
        </defs>
        <g mask="url(#vignette)">
          <path
            className="animate-path stroke-[#58F0D4] stroke-[0.5]"
            d="M184.5 114.5H2C154.667 262.5 458 556.385 494 591C530 625.615 612.5 613 612.5 541.5V114.5H485.5V406L184.5 114.5Z"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="animate-path stroke-[#58F0D4] stroke-[0.5]"
            d="M653.5 114.5H1075L774 410V1C774 1 954.5 1 1075 1C1195.5 1 1282 114.5 1282 207C1282 299.5 1282 495.5 1282 495.5H868.5L1162 207V609.5C1162 609.5 998 609.5 868.5 609.5C739 609.5 653.5 487 653.5 410C653.5 333 653.5 114.5 653.5 114.5Z"
            style={{ animationDelay: '2s' }}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  )
}

export default function Component() {
  const [inputText, setInputText] = useState('')
  const [isEnhanced, setIsEnhanced] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showLegalPopup, setShowLegalPopup] = useState(false)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(280, Math.max(48, textarea.scrollHeight))}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputText])

  const handleEnhanceClick = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    const originalText = inputText
    setInputText("")
    
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: originalText }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance prompt')
      }

      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setInputText(data.enhancedPrompt)
      setIsEnhanced(true)
    } catch (error) {
      console.error('Error enhancing prompt:', error)
      setInputText(originalText)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLegalPopup && !(event.target as Element).closest('.legal-popup')) {
        setShowLegalPopup(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showLegalPopup])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white relative overflow-hidden">
      <BackgroundAnimation />
      <header className="container relative z-10 flex h-14 items-center px-4 md:px-6">
        <Link href="/" className="focus-visible:ring-offset-background inline-flex shrink-0 items-center justify-center gap-1.5 text-white">
          <svg fill="currentColor" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="size-10">
            <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V0Z" />
            <path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z" />
          </svg>
          <span className="sr-only">New Chat</span>
        </Link>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="container flex flex-col items-center justify-center px-4 md:px-6 py-16">
          <h1 className="mb-12 text-4xl font-bold tracking-tighter text-center">What can I help you ship?</h1>
          <div className="w-full max-w-[720px] mb-8">
            <div className="flex flex-col gap-2 bg-white/5 rounded-lg p-2 relative">
              <div className="absolute -top-16 right-4 w-24 h-24">
                <Image
                  src="/wcat.gif"
                  alt="Cat animation"
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="thinking text-base"></span>
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  className={`min-h-[48px] border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-3 overflow-y-auto transition-opacity duration-200 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  placeholder="Ask v0 a question..."
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value)
                    adjustTextareaHeight()
                  }}
                  disabled={isLoading}
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.5',
                    maxHeight: '280px',
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-white/10">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                    <span className="ml-1 text-muted-foreground">Project</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {inputText.trim() && (
                    <Button
                      size="icon"
                      onClick={handleEnhanceClick}
                      disabled={isLoading}
                      className="h-7 w-7 rounded-full bg-[#00DC82] text-black hover:bg-[#00DC82]/90 transition-all duration-300 enhance-button-appear"
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="icon" className="h-7 w-7 rounded-full">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-20 min-h-0 shrink-0 items-center justify-center sm:h-16">
            <div className="flex flex-wrap justify-center gap-3">
              <h2 className="sr-only">Suggested Chat Messages</h2>
              <button 
                onClick={() => setInputText("Generate a sticky header")}
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap text-nowrap border border-muted-foreground/20 px-2 text-xs rounded-full hover:bg-white/5 text-muted-foreground h-6 gap-0.5"
              >
                <span className="block md:hidden">Generate a sticky header</span>
                <span className="hidden md:block">Generate a sticky header</span>
                <svg className="ml-0.5 size-4" data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentcolor' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.75011 4H6.00011V5.5H6.75011H9.43945L5.46978 9.46967L4.93945 10L6.00011 11.0607L6.53044 10.5303L10.499 6.56182V9.25V10H11.999V9.25V5C11.999 4.44772 11.5512 4 10.999 4H6.75011Z" fill="currentColor" />
                </svg>
              </button>
              <button 
                onClick={() => setInputText("How can I structure LLM output?")}
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap text-nowrap border border-muted-foreground/20 px-2 text-xs rounded-full hover:bg-white/5 text-muted-foreground h-6 gap-0.5"
              >
                <span className="block md:hidden">Structure LLM output</span>
                <span className="hidden md:block">How can I structure LLM output?</span>
                <svg className="ml-0.5 size-4" data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentcolor' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.75011 4H6.00011V5.5H6.75011H9.43945L5.46978 9.46967L4.93945 10L6.00011 11.0607L6.53044 10.5303L10.499 6.56182V9.25V10H11.999V9.25V5C11.999 4.44772 11.5512 4 10.999 4H6.75011Z" fill="currentColor" />
                </svg>
              </button>
              <button 
                onClick={() => setInputText("Calculate the factorial of a number")}
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap text-nowrap border border-muted-foreground/20 px-2 text-xs rounded-full hover:bg-white/5 text-muted-foreground h-6 gap-0.5"
              >
                <span className="block md:hidden">Calculate factorial</span>
                <span className="hidden md:block">Calculate the factorial of a number</span>
                <svg className="ml-0.5 size-4" data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentcolor' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.75011 4H6.00011V5.5H6.75011H9.43945L5.46978 9.46967L4.93945 10L6.00011 11.0607L6.53044 10.5303L10.499 6.56182V9.25V10H11.999V9.25V5C11.999 4.44772 11.5512 4 10.999 4H6.75011Z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-xs absolute bottom-4 w-full flex justify-center z-50">
        <nav className="flex h-4 divide-x divide-white/[0.03] relative">
          <Link 
            href="https://v0.dev/pricing" 
            className="flex items-center gap-1 text-gray-600 transition-colors hover:text-gray-900 px-2 relative"
          >
            Pricing
          </Link>
          <Link 
            href="https://v0.dev/enterprise" 
            className="flex items-center gap-1 text-gray-600 transition-colors hover:text-gray-900 px-2 relative"
          >
            Enterprise
          </Link>
          <Link 
            href="https://v0.dev/faq" 
            className="flex items-center gap-1 text-gray-600 transition-colors hover:text-gray-900 px-2 relative"
          >
            FAQ
          </Link>
          <div className="flex items-center gap-1 text-gray-600 transition-colors hover:text-gray-900 px-2 relative">
            <button 
              onClick={() => setShowLegalPopup(!showLegalPopup)}
              className="relative"
            >
              Legal
              {showLegalPopup && (
                <div className="absolute bottom-full mb-2 bg-[#1a1a1a] rounded-lg shadow-lg p-2 min-w-[160px] legal-popup z-50">
                  <Link 
                    href="https://v0.dev/policy" 
                    className="block px-4 py-2 hover:bg-white/5 rounded-md"
                  >
                    AI Policy
                  </Link>
                  <Link 
                    href="https://v0.dev/agreement" 
                    className="block px-4 py-2 hover:bg-white/5 rounded-md"
                  >
                    Terms
                  </Link>
                </div>
              )}
            </button>
          </div>
          <Link 
            href="https://v0.dev/legacy" 
            className="items-center gap-1 text-gray-600 transition-colors hover:text-gray-900 px-2 hidden sm:flex relative"
          >
            Legacy v0
          </Link>
          <Link 
            href="https://vercel.com/warpdevs?utm_source=v0-site&utm_medium=banner&utm_campaign=home" 
            className="flex items-center gap-1 text-gray-600 transition-colors hover:text-gray-900 px-2 relative"
            target="_blank"
          >
            Vercel
            <svg className="size-[10px]" data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentcolor' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M13.5 10.25V13.25C13.5 13.3881 13.3881 13.5 13.25 13.5H2.75C2.61193 13.5 2.5 13.3881 2.5 13.25L2.5 2.75C2.5 2.61193 2.61193 2.5 2.75 2.5H5.75H6.5V1H5.75H2.75C1.7835 1 1 1.7835 1 2.75V13.25C1 14.2165 1.7835 15 2.75 15H13.25C14.2165 15 15 14.2165 15 13.25V10.25V9.5H13.5V10.25ZM9 1H9.75H14.2495C14.6637 1 14.9995 1.33579 14.9995 1.75V6.25V7H13.4995V6.25V3.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L12.4388 2.5H9.75H9V1Z" fill="currentColor" />
            </svg>
          </Link>
        </nav>
      </footer>
    </div>
  )
}