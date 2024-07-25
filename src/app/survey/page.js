
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
    country: "", // Default empty
    city: "",
    postal: "",
    device: "",
    browser: "",
    ip: "",
    gender: "",
    age: "",
  });
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [countries, setCountries] = useState([]);
  const auth = getAuth(app);

  // Initialize form based on URL parameter
  useEffect(() => {
    if (router.isReady) {
      const location = router.query.location;
      if (location) {
        setForm((prevForm) => ({
          ...prevForm,
          country: location,
        }));
      }
    }
  }, [router.isReady, router.query]);

  const handleLocationChange = (event) => {
    const newLocation = event.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      country: newLocation,
    }));
    router.push(`/survey?location=${newLocation}`, undefined, { shallow: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
      city: "",
      postal: "",
    }));

    

    if (name === "country") {
      handleLocationChange(e);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/countries.json');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const getIpInfo = async (ipAddress) => {
    try {
      const response = await fetch(`https://ipinfo.io/${ipAddress}/json`);
      const data = await response.json();
      const countryName = countryList.getName(data.country);

      setForm((prevForm) => ({
        ...prevForm,
        country: countryName,
        city: data.city,
        postal: data.postal,
      }));
      handleLocationChange({ target: { value: countryName } });
      return countryName; // Return the country name for setting default value
    } catch (e) {
      console.error("Failed to fetch location info: ", e);
      return "";
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
      const detectedCountry = await getIpInfo(ipAddress);

      setForm((prevForm) => ({
        ...prevForm,
        device: deviceType,
        browser: browserType,
        ip: ipAddress,
      }));

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          setForm((prevForm) => ({
            ...prevForm,
            name: user.displayName || "",
            email: user.email || "",
            country: detectedCountry, // Set the country from IP
          }));
        } else {
          router.push("/");
        }
      });

      return () => unsubscribe();
    };

    initialize();
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
      form.name &&
      form.email &&
      form.phone &&
      form.country &&
      form.city &&
      form.postal &&
      form.device &&
      form.browser &&
      form.ip
      // form.ip &&
      // form.age
    ) {
      // if (form.age < 1) {
      //   setError("Age should be greater than 0");
      //   return;
      // }
      try {
        const docRef = await addDoc(collection(db, "info"), {
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: {
            country: form.country,
            city: form.city,
            postal: form.postal,
          },
          device: form.device,
          browser: form.browser,
          ip: form.ip,
          gender: form.gender,
          age: form.age,
          timestamp: new Date(),
        });
        console.log("Document written with ID: ", docRef.id , docRef);
        setForm({
          name: "",
          email: "",
          phone: "",
          country: "",
          city: "",
          postal: "",
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
        <h1 className="text-md font-bold text-[#b6b3b3] text-black text-center md:text-xl">
          Welcome {user.displayName}
        </h1>
      )}
      <div>
        <h1 className="text-4xl font-bold text-black text-center mb-8">
          Lead Generation Form
        </h1>

        <form
          className="p-10 rounded-lg"
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
              <label htmlFor="name" className="md:w-[150px] text-xl">
                Name <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-md p-2 focus:outline-none focus:bg-white text-black shadow border-2 bg-transparent border-[#ffffff8f]"
                // required
              />
            </div>
            <div className="flex flex-col items-center md:gap-5 md:flex-row">
              <label htmlFor="email" className="md:w-[150px] text-xl">
                Email <span className="text-red-700">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-md p-2 focus:outline-none focus:bg-white text-black shadow border-2 bg-transparent border-[#ffffff8f]"
                // required
              />
            </div>
            <div className="flex flex-col items-center md:gap-5 md:flex-row">
              <label htmlFor="phone" className="md:w-[150px] text-xl">
                Phone <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-md p-2 focus:outline-none focus:bg-white text-black shadow border-2 bg-transparent border-[#ffffff8f]"
              />
            </div>


            <div className="flex flex-col items-center md:gap-5 md:flex-row hidden">
              <label htmlFor="country" className="md:w-[150px] text-xl">
                Country <span className="text-red-700">*</span>
              </label>


              <select
                id="country"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="rounded-md p-2 focus:outline-none w-[240px] focus:bg-white text-black shadow border-2 bg-transparent border-[#ffffff8f]"
                // required
                readOnly
              >
                <option value="">Select a country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>



            <div className="flex flex-col items-center md:gap-5 md:flex-row hidden">
              <label htmlFor="city" className="md:w-[150px] text-xl">
                City <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="rounded-md p-2 focus:outline-none focus:bg-white text-black shadow border-2 bg-transparent border-[#ffffff8f]"
                // required
                
              />
            </div>
            <div className="flex flex-col items-center md:gap-5 md:flex-row hidden">
              <label htmlFor="postal" className="md:w-[150px] text-xl">
                Postal Code <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="postal"
                name="postal"
                value={form.postal}
                onChange={(e) => setForm({ ...form, postal: e.target.value })}
                className="rounded-md p-2 focus:outline-none focus:bg-white text-black shadow border-2 bg-transparent border-[#ffffff8f]"
                // required
              />
            </div>
            <div className="flex flex-col items-center md:gap-5 md:flex-row hidden">
              <label htmlFor="gender" className="md:w-[150px] text-xl">
                Gender <span className="text-red-700">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="rounded-md p-2 w-[240px] focus:outline-none focus:bg-white text-black shadow border-2 bg-transparent border-[#ffffff8f] hidden"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col items-center md:gap-5 md:flex-row hidden">
              <label htmlFor="age" className="md:w-[150px] text-xl">
                Age <span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="rounded-md p-2 focus:outline-none focus:bg-white text-black shadow border-2 bg-transparent border-[#ffffff8f]"
                // required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="bg-[#ca11e8] hover:bg-[#3043c6] text-white rounded-md p-2 focus:outline-none"
            >
              Submit
            </button>
            {user && (
              <div className="flex gap-1 justify-center">
                <h1 className="text-md font-bold text-[#b6b3b3] text-black text-center">
                  Want to Sign Out?
                </h1>
                <button
                  onClick={handleLogout}
                  className="text-black rounded hover:font-bold hover:underline"
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
