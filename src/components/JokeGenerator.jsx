import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

const localJokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call a fake noodle? An impasta!",
  "Why did the math book look so sad? Because it had too many problems!",
];

const JokeGenerator = () => {
  const [joke, setJoke] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJoke = async () => {
    setIsLoading(true);
    setError(null);

    const url =
      "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single,twopart";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.message || "Failed to fetch joke");
      }
      if (data.type === "single") {
        setJoke(data.joke);
      } else if (data.type === "twopart") {
        setJoke(`${data.setup} ${data.delivery}`);
      }
    } catch (error) {
      console.error("Error fetching joke:", error);
      setError("Failed to fetch online joke. Using a local joke instead.");
      const randomIndex = Math.floor(Math.random() * localJokes.length);
      setJoke(localJokes[randomIndex]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-white">
          Random Joke Generator
        </h1>
        {error && (
          <p className="text-sm mb-4 text-center text-yellow-300">{error}</p>
        )}
        <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
          <p className="text-xl mb-4 text-center text-white">
            {isLoading ? "Loading..." : joke}
          </p>
        </div>
        <button
          onClick={fetchJoke}
          disabled={isLoading}
          className="w-full py-3 px-6 bg-white text-purple-600 font-semibold rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-all duration-300 flex items-center justify-center"
        >
          <RefreshCw className="mr-2" size={20} />
          {isLoading ? "Fetching..." : "Get New Joke"}
        </button>
      </div>
    </div>
  );
};

export default JokeGenerator;
