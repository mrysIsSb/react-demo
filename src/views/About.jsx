
// import { marked } from 'marked';
import React from 'react';
import md from '../markdown/About.md';
import '../css/Main.css';

const About = () => {
  // const html = marked.parse(md);
  return (
    <span className='markdown' dangerouslySetInnerHTML={{ __html: md }} />
  );
};

export default About;