import "../styles/Statistics.css";

const Statistics = ({ goBack }: { goBack: () => void }) => {
    return (
      <div className="main-div">
        <h1>Statistics</h1>
        <button onClick={goBack}>Back to Homepage</button>
      </div>
    );
  };
  
  export default Statistics;
  