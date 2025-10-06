import Layout from "./Layout.jsx";

import Home from "./Home";

import Character from "./Character";

import Adventure from "./Adventure";

import AdventureGenerator from "./AdventureGenerator";

import QuestSelection from "./QuestSelection";

import QuestStart from "./QuestStart";

import DMTools from "./DMTools";

import AdventureBuilder from "./AdventureBuilder";

import AdventureBrowser from "./AdventureBrowser";

import About from "./About";

import Terms from "./Terms";

import Privacy from "./Privacy";

import Contact from "./Contact";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Character: Character,
    
    Adventure: Adventure,
    
    AdventureGenerator: AdventureGenerator,
    
    QuestSelection: QuestSelection,
    
    QuestStart: QuestStart,
    
    DMTools: DMTools,
    
    AdventureBuilder: AdventureBuilder,
    
    AdventureBrowser: AdventureBrowser,
    
    About: About,
    
    Terms: Terms,
    
    Privacy: Privacy,
    
    Contact: Contact,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Character" element={<Character />} />
                
                <Route path="/Adventure" element={<Adventure />} />
                
                <Route path="/AdventureGenerator" element={<AdventureGenerator />} />
                
                <Route path="/QuestSelection" element={<QuestSelection />} />
                
                <Route path="/QuestStart" element={<QuestStart />} />
                
                <Route path="/DMTools" element={<DMTools />} />
                
                <Route path="/AdventureBuilder" element={<AdventureBuilder />} />
                
                <Route path="/AdventureBrowser" element={<AdventureBrowser />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Terms" element={<Terms />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/Contact" element={<Contact />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}