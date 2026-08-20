import About from '../components/About'

/* Who We Are is now its own route rather than a home-page section.

   The existing About component already carries the full narrative —
   vision & mission, the 2014 origin story, Our Journey with its stat
   blocks and scroll-drawn timeline, management, board and shareholders —
   so this page renders it in `standalone` mode, which is only a padding
   change: the first masthead has to clear the fixed navbar now that it
   sits at the top of the document rather than halfway down a scroll. */
export default function WhoWeAre() {
  return (
    <div>
      <About standalone />
    </div>
  )
}
