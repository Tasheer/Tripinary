import "./index.css" ;
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import PlanTrip from "./pages/PlanTrip";
import ShareExperience from "./pages/ShareExperience";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="App">

      <Router>

        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/tripPlanner' element={<PlanTrip />} />
        <Route path='/suggestion' element={<ShareExperience />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        </Routes>

      </Router>
    </div>
  );
}

export default App;
