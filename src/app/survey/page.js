"use client";
import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/navigation";
import app from "../firebase";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import UAParser from "ua-parser-js";
import countryList from 'country-list';

export default function Survey() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    pincode: "",
    device: "",
    browser: "",
    ip: "",
    gender: "",
    age: "",
  });
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const auth = getAuth(app);


  const getIpInfo = async (ipAddress) => {
    try {
      const response = await fetch(`https://ipinfo.io/${ipAddress}/json`);
      const data = await response.json();
      const countryName = countryList.getName(data.country);

   
      setForm((prevForm) => ({
        ...prevForm,
        country: countryName,
        city: data.city,
        pincode: data.postal,
      }));
    } catch (e) {
      console.error("Failed to fetch location info: ", e);
    }
  };

  const fetchIPAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return "";
    }
  };

  const fetchDeviceType = () => {
    try {
      const parser = new UAParser();
      const result = parser.getResult();
      return result.os.name || "Unknown";
    } catch (error) {
      console.error("Error fetching device type:", error);
      return "Unknown";
    }
  };

  const fetchBrowserType = () => {
    try {
      const parser = new UAParser();
      const result = parser.getResult();
      return result.browser.name || "Unknown";
    } catch (error) {
      console.error("Error fetching browser type:", error);
      return "Unknown";
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const ipAddress = await fetchIPAddress();
      const deviceType = fetchDeviceType();
      const browserType = fetchBrowserType();
      getIpInfo(ipAddress);

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          setForm((prevForm) => ({
            ...prevForm,
            name: user.displayName,
            email: user.email,
            device: deviceType,
            browser: browserType,
            ip: ipAddress,
          }));
        } else {
          router.push("/");
        }
      });

      return () => unsubscribe();
    };

    initialize();
  }, [auth, router]);

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      form.name !== "" &&
      form.email !== "" &&
      form.phone !== "" &&
      form.country !== "" &&
      form.city !== "" &&
      form.pincode !== "" &&
      form.device !== "" &&
      form.browser !== "" &&
      form.ip !== "" &&
      form.age !== ""
    ) {
      if (form.age < 1) {
        setError("Age should be greater than 0");
        return;
      }
      try {
        const docRef = await addDoc(collection(db, "info"), {
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: {
            country: form.country,
            city: form.city,
            pincode: form.pincode,
          },
          device: form.device,
          browser: form.browser,
          ip: form.ip,
          gender: form.gender,
          age: form.age,
          timestamp: new Date(),
        });
        console.log("Document written with ID: ", docRef.id);
        setForm({
          name: "",
          email: "",
          phone: "",
          country: "",
          city: "",
          pincode: "",
          device: "",
          browser: "",
          ip: "",
          gender: "",
          age: "",
        });
        router.push("/Dashboard");
      } catch (error) {
        console.error("Error adding document: ", error);
        setError("Failed to submit form. Please try again later.");
      }
    } else {
      setError("Please fill all the fields");
    }
  };

  return (
    <main className="flex min-h-screen flex-col gap-5 items-center justify-center p-4">
      {user && (
        <h1 className="text-md font-bold text-[#b6b3b3] text-center md:text-xl">
          Welcome {user.displayName}
        </h1>
      )}
      <div>
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Lead Generation Form
        </h1>

        <form
          className=" p-10 rounded-lg"
          style={{
            background: "rgba(217, 217, 217, 0.193)",
            boxShadow:
              "inset 63.6667px -63.6667px 63.6667px rgba(165, 165, 165, 0.193), inset -63.6667px 63.6667px 63.6667px rgba(255, 255, 255, 0.193)",
            backdropFilter: "blur(142.613px)",
          }}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-center md:gap-5 md:flex-row">
              <label htmlFor="name" className=" md:w-[150px] text-xl">
                Name <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className=" rounded-md p-2 focus:outline-none focus:bg-white text-black  shadow border-2  bg-transparent border-[#ffffff8f] "
                required
              />
            </div>
            <div className="flex flex-col items-center md:gap-5 md:flex-row">
              <label htmlFor="email" className=" md:w-[150px] text-xl">
                Email <span className="text-red-700">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className=" rounded-md p-2 focus:outline-none focus:bg-white text-black  shadow border-2  bg-transparent border-[#ffffff8f] "
                required
              />
            </div>
            <div className="flex flex-col items-center md:gap-5 md:flex-row">
              <label htmlFor="phone" className=" md:w-[150px] text-xl">
                Phone <span className="text-red-700">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className=" rounded-md p-2 focus:outline-none focus:bg-white text-black  shadow border-2  bg-transparent border-[#ffffff8f] "
              />
            </div>
            <div className="flex flex-col items-center md:gap-5 md:flex-row">
              <label htmlFor="country" className=" md:w-[150px] text-xl">
                Country <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className=" rounded-md p-2 focus:outline-none focus:bg-white text-black  shadow border-2  bg-transparent border-[#ffffff8f] "
                required
              />
            </div>
            <div className="flex flex-col items-center md:gap-5 md:flex-row">
              <label htmlFor="city" className=" md:w-[150px] text-xl">
                City <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className=" rounded-md p-2 focus:outline-none focus:bg-white text-black  shadow border-2  bg-transparent border-[#ffffff8f] "
                required
              />
            </div>
            <div className="flex flex-col items-center md:gap-5 md:flex-row">
              <label htmlFor="pincode" className=" md:w-[150px] text-xl">
                Pincode <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className=" rounded-md p-2 focus:outline-none focus:bg-white text-black  shadow border-2  bg-transparent border-[#ffffff8f] "
                required
              />
            </div>

            <div className="flex flex-col items-center md:gap-5 md:flex-row">
              <label htmlFor="gender" className=" md:w-[150px] text-xl">
                Gender <span className="text-red-700">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className=" rounded-md p-2 focus:outline-none focus:bg-white text-black  shadow border-2  bg-transparent border-[#ffffff8f] "
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col items-center md:gap-5 md:flex-row">
              <label htmlFor="age" className=" md:w-[150px] text-xl">
                Age <span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className=" rounded-md p-2 focus:outline-none focus:bg-white text-black  shadow border-2  bg-transparent border-[#ffffff8f] "
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="bg-[#ca11e8]  hover:bg-[#3043c6]  text-white rounded-md p-2 focus:outline-none "
            >
              Submit
            </button>

            {user && (
              <div className="flex gap-1 justify-center">
                <h1 className="text-md font-bold text-[#b6b3b3] text-center ">
                  Want to Sign Out?
                </h1>
                <button
                  onClick={handleLogout}
                  className=" text-white rounded hover:font-bold hover:underline"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
