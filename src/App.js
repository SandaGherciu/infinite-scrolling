import "./App.scss";
import React, { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(0);
  const [results, setResults] = useState(posts);

  const handleChange = (e) => {
    const { value } = e.target;
    setInput(value);
    setFilter(
      posts.filter(
        (post) =>
          post.title.includes(value.toLowerCase()) ||
          post.body.includes(value.toLowerCase())
      )
    );
  };

  useEffect(() => {
    if (input.length > 0) {
      setResults(filter);
    } else {
      setResults(posts);
    }
  }, [input, filter, posts]);

  const handleScroll = () => {
    const windowHeight =
      (window && window.innerHeight) || document.documentElement.offsetHeight;
    const html = document.documentElement;

    const windowBottom = windowHeight + window.pageYOffset + 1;
    if (windowBottom >= html.scrollHeight && posts.length !== 100) {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const loadMore = () => {
      setStart(start + 4);
    };
    loadMore();
  }, [isLoading, start]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=4`
        );
        if (result.ok) {
          const postsData = await result.json();
          setPosts((p) => [...p, ...postsData]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [start]);

  return (
    <div className="App">
      <header>
        <h1>My Blog</h1>
      </header>

      <div id="container">
        <input
          type="text"
          placeholder="Filter..."
          value={input}
          onChange={handleChange}
        />

        {results.map((post) => {
          return (
            <div className="post-containers" key={post.id}>
              <div className="id-number">
                <h4>{post.id}</h4>
              </div>

              <div className="post-content">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </div>
            </div>
          );
        })}
        {isLoading && <div id="loader"></div>}
      </div>
    </div>
  );
}

export default App;
