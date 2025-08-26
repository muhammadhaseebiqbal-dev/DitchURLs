"use client"
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import WrapButton from "@/components/ui/wrap-button"
import { ArrowBigDownDash, ChevronDown, CircleCheckIcon, Copy, Globe, XOctagonIcon } from "lucide-react";
import { Lato } from "next/font/google";
import axios from "axios";
import Toast from "@/components/ui/toast";
import { AnimatePresence, motion } from "motion/react";
import '@/app/globals.css'
import { Qr } from "@qrgrid/react/canvas";
import { dotModuleStyle } from "@qrgrid/styles/canvas/styles";
import { downloadQr } from "@qrgrid/styles/canvas";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});


export default function PAGE() {

  const [link, setLink] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isToast, setIsToast] = useState<boolean>(false)
  const [toastVariant, setToastVariant] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [expiry, setExpiry] = useState<string>('')
  const [alias, setAlias] = useState<string>('')
  const [directLink, setDirectLink] = useState<string>('')
  const [isPopup, setIsPopup] = useState<boolean>(false)
  const downloadQRElem = useRef<HTMLCanvasElement | null>(null)


  // Handlers
  const handleLinkField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e?.target?.value)
  }
  const handlePasswordField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e?.target?.value)
  }
  const handleExpiryField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExpiry(e?.target?.value)
  }
  const handleAliasField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlias(e?.target?.value)
  }
  const handleX = () => {
    setIsPopup(false)
  }
  const handleCopy = () => {
    if (directLink) {
      navigator.clipboard.writeText(directLink)
        .then(() => {
          setIsToast(true);
          setToastMessage("URL copied to clipboard!");
          setToastVariant("supportive");

          setTimeout(() => {
            setIsToast(false);
            setToastMessage("");
            setToastVariant("");
          }, 1500);
        })
        .catch(() => {
          setIsToast(true);
          setToastMessage("Failed to copy URL!");
          setToastVariant("destructive");

          setTimeout(() => {
            setIsToast(false);
            setToastMessage("");
            setToastVariant("");
          }, 1500);
        });
    } else {
      setIsToast(true);
      setToastMessage("Error copying url");
      setToastVariant("destructive");

      setTimeout(() => {
        setIsToast(false);
        setToastMessage("");
        setToastVariant("");
      }, 1500);
    }
  }
  const handleQRDownload = () => {
    if (downloadQRElem?.current) {
      downloadQr(downloadQRElem?.current)
    }
  }

  const handleHassleFree = async () => {

    setIsLoading(true)

    if (!link) {
      setIsLoading(false)
      setIsToast(true)
      setToastMessage("The URL is empty")
      setToastVariant("destructive")

      setTimeout(() => {
        setIsToast(false)
        setToastMessage("")
        setToastVariant("")
      }, 1500);

      return false;
    }

    let formattedLink = link;

    if (!link.startsWith("https://") && !link.startsWith("http://")) {
      console.log("Link is not properly formatted:", link);
      formattedLink = `http://${link}`;
      setLink(formattedLink);
      console.log("formatted: ", formattedLink);
    }

    console.log(expiry)

    try {
      await axios.post('/api/routes/ditchit', {
        actual_url: formattedLink,
        short_code: alias,
        expire_at: expiry,
        password: password
      }).then((response) => {
        setLink('')
        setPassword('');
        setExpiry('');
        setAlias('');
        console.log(response.data)

        if (response.data.success) {
        setDirectLink(`${process.env.NEXT_PUBLIC_APP_URL}/${response.data.short_code}`);
        setIsPopup(true)
            setIsToast(true)
            setIsLoading(false)

            setToastMessage(response.data.message)
            setToastVariant("supportive")

            setTimeout(() => {
              setIsToast(false)
              setToastMessage("")
              setToastVariant("")
            }, 1500);
          } else {
            setIsToast(true)
            setIsLoading(false)

            setToastMessage(response.data.message)
            setToastVariant("destructive")

            setTimeout(() => {
              setIsToast(false)
              setToastMessage("")
              setToastVariant("")
            }, 1500);
          }
      })

    } catch (error) {
      setIsToast(true)
      setIsLoading(false)

      setToastMessage("Unexpected error occured! Try again")
      setToastVariant("destructive")

      setTimeout(() => {
        setIsToast(false)
        setToastMessage("")
        setToastVariant("")
      }, 1500);
    }
  }

  return (
    <div className="relative flex h-[100svh] w-full overflow-hidden bg-black/[0.96] antialiased md:items-center md:justify-center">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
        )}
      />

      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-50"
        fill="white"
      />
      <div className="flex relative -mt-10 lg:-mt-0 h-full justify-center flex-col items-center gap-1 z-10 w-full max-w-7xl p-4 pt-20 md:pt-0">
        <div className="w-full h-[50%] flex justify-center items-center">
          <h1
            className={` text-white text-5xl font-extrabold top-30 ${lato.variable} font-sans mt-20`}
          >
            Ditch URLs
          </h1>
        </div>
        <div className="w-full h-full flex flex-col items-center py-8 gap-4">
          <input
            className="bg-[#151515] p-5 w-[95%] rounded-full lg:w-[50%] text-gray-400/70 outline-none border-1 border-white/10"
            placeholder="https://example.com"
            type="url" name="link-input" value={link} onChange={handleLinkField}
          />
          <AnimatePresence>
            {link && (
              <motion.div
                key={"advanced-options"}
                initial={{ y: -10, opacity: 0 }}
                animate={
                  { y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ type: 'tween', duration: 0.2, delay: 0.2 }}
                className={`flex flex-col text-white items-start bg-[#151515] hover:bg-[#151515] border-1 border-white/10 rounded-lg w-[%] lg:w-[35%] px-5 py-4 box-border gap-2`}
              >
                <div className="flex items-center gap-2">
                  <ChevronDown className="transform -rotate-90" />
                  <span>Advanced options</span>
                </div>
                <input
                  type="text"
                  placeholder=" Custom alias / optional"
                  className="bg-[#1f1f1f] mt-3 text-white rounded-full p-2 w-full outline-none border-1 border-white/10"
                  onChange={handleAliasField}
                  value={alias}
                />
                <input
                  type="password"
                  placeholder=" Password / optional"
                  className="bg-[#1f1f1f] text-white rounded-full p-2 w-full outline-none border-1 border-white/10"
                  onChange={handlePasswordField}
                  value={password}
                />
                <select
                  className="bg-[#1f1f1f] border-1 border-white/10 text-white rounded-full p-2 w-full outline-none"
                  onChange={handleExpiryField}
                  value={expiry}
                >
                  <option value="">Default expiry</option>
                  <option value="10min">10min</option>
                  <option value="30min">30min</option>
                  <option value="1hours">1hours</option>
                  <option value="2hours">2hours</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          <WrapButton className="btn mt-8" onClick={handleHassleFree}>
            <Globe className={isLoading ? 'animate-spin' : ''} />
            Go Hassle-Free
          </WrapButton>

          <AnimatePresence>
            {isToast && <Toast variant={toastVariant} message={toastMessage} />}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {isPopup && <motion.div
          initial={{ width: window.innerWidth > 768 ? '48%' : '95%', height: '10%', borderRadius: '9999px', opacity: 0 }}
          animate={{ width: window.innerWidth > 768 ? '60%' : '95%', height: window.innerWidth > 768 ? '66%' : '85%', borderRadius: '30px', opacity: 1 }}
          exit={{ width: window.innerWidth > 768 ? '48%' : '95%', height: '9%', borderRadius: '9999px', opacity: 0 }}
          transition={{
            type: 'tween',
            duration: 0.5,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 lg:gap-0 gap-4 -translate-y-1/2 -translate-x-1/2 overflow-hidden flex flex-col lg:flex-row items-center w-[48%] rounded-full z-10 bg-[#151515] p-5 border-1 border-white/10 lg:top-auto lg:left-auto lg:transform-none  lg:translate-x-0 lg:-translate-y-16 h-[9%]"
        >
            <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'tween', duration: 0.5, delay: 0.5 }}
            className="rounded-lg overflow-hidden lg:w-fit h-fit w-fit"
            >
            <Qr
              ref={downloadQRElem}
              input={directLink}
              qrOptions={{ errorCorrection: 'Q' }}
              bgColor="rgba(194,55,3,0.1)"
              color="#fff"
              moduleStyle={dotModuleStyle}
              image={{ src: "logo.png", overlap: false }}
              size={window.innerWidth > 768 ? 400 : 200}
            />
            </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'tween', duration: 0.5, delay: 0.7 }}
            className="flex flex-col justify-center lg:gap-3 gap-4 items-center w-full lg:w-[49%] h-fit"
          >
            <CircleCheckIcon fill="#0cb300" size={60} color="#ffff" />
            <h1 className="text-2xl font-extrabolder text-white">Ditched!</h1>
            <input type="url" value={directLink} readOnly className="bg-[#151515] p-5 w-[90%] rounded-full text-gray-400/70 outline-none border-1 border-white/10" />
            <button onClick={handleCopy} className="flex gap-2 bg-green-700 hover:bg-green-700/70 cursor-pointer py-3 px-4 rounded-full text-white font-bold">
              <Copy />
              <span>Copy URL</span>
            </button>
            <button onClick={handleQRDownload} className="flex gap-2 bg-[#ff4500] hover:bg-[#c43400] cursor-pointer py-3 px-4 rounded-full text-white font-bold">
              <ArrowBigDownDash />
              <span>Download QR</span>
            </button>
          </motion.div>
          <div onClick={handleX} className="cursor-pointer flex justify-center items-center w-10 h-10 absolute top-4 right-4">
            <XOctagonIcon size={32} stroke="#ffff" />
          </div>
        </motion.div>}
      </AnimatePresence>


      <div>

      </div>
    </div>
  )
}