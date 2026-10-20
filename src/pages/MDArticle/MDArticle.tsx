import Markdown from "react-markdown";
import { useLoaderData } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import styles from "./MDArticle.module.css"

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function MDArticle() {
  const data = useLoaderData() as string;
  return (
    <main className={`page ${styles.mdarticle}`}>
      <Markdown
        components={{
          img: (props) => <Zoom><img {...props}/></Zoom>
        }}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {data}
      </Markdown>
    </main>
  );
}
