import React, { useState, useEffect } from 'react';

    const languages = [
      { name: 'JavaScript', value: 'javascript' },
      { name: 'Python', value: 'python' },
      { name: 'Java', value: 'java' },
      { name: 'C++', value: 'c++' },
      { name: 'C#', value: 'csharp' },
      { name: 'Ruby', value: 'ruby' },
      { name: 'PHP', value: 'php' },
      { name: 'Go', value: 'go' },
      { name: 'Swift', value: 'swift' },
      { name: 'Kotlin', value: 'kotlin' },
    ];

    function App() {
      const [selectedLanguage, setSelectedLanguage] = useState('');
      const [repo, setRepo] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const fetchRepo = async () => {
        if (!selectedLanguage) {
          return;
        }
        setLoading(true);
        setError(null);
        setRepo(null);
        try {
          const response = await fetch(
            `https://api.github.com/search/repositories?q=language:${selectedLanguage}&sort=stars&order=desc`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.items.length);
            setRepo(data.items[randomIndex]);
          } else {
            setRepo(null);
          }
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };

      const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
        setRepo(null);
      };

      const handleRefresh = () => {
        fetchRepo();
      };

      useEffect(() => {
        if (selectedLanguage) {
          fetchRepo();
        }
      }, [selectedLanguage]);

      return (
        <div className="container">
          <div className="header">
            <div className="icon"></div>
            <h2>GitHub Repository Finder</h2>
          </div>
          <div className="select-container">
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="">Select a Language</option>
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          {loading && (
            <div className="message loading">Loading, please wait..</div>
          )}
          {error && (
            <div className="message error">
              Error fetching repositories
              <button onClick={fetchRepo}>Click to retry</button>
            </div>
          )}
          {!loading && !error && !repo && selectedLanguage && (
            <div className="message">No repositories found for this language.</div>
          )}
          {repo && (
            <div className="repo-card">
              <h3>{repo.name}</h3>
              <p>{repo.description}</p>
              <div className="stats">
                <span className="language">
                  {repo.language}
                </span>
                <span className="star">
                  {repo.stargazers_count}
                </span>
                <span className="fork">
                  {repo.forks_count}
                </span>
                <span className="issue">
                  {repo.open_issues_count}
                </span>
              </div>
            </div>
          )}
          {repo && (
            <button className="refresh-button" onClick={handleRefresh}>
              Refresh
            </button>
          )}
          {!selectedLanguage && (
            <div className="message">Please select a language</div>
          )}
        </div>
      );
    }

    export default App;
