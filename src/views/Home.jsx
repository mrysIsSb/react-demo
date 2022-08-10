
import { marked } from 'marked';
import React from 'react';
import md from '../markdown/HelloMD.md';
import '../css/Main.css';

const Home = () => {
  console.log(md);
  const html = marked.parse(md);
  console.log(html);
  return (
    <span className='markdown' dangerouslySetInnerHTML={{ __html: md }} />
  );
};

export default Home;