import { Reveal } from "../Reveal";

export function AboutSection() {
  return (
    <section id="about" className="bg-cream px-6 py-32 text-chocolate md:py-44">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal variant="label">
          <p className="mb-6 text-[12px] tracking-[0.35em] text-chocolate/45 uppercase">
            About Derlings
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl leading-[1.15] font-medium italic md:text-5xl">
            Everyday food should be something to look forward to.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-[480px] space-y-5 text-[15px] leading-[1.8] text-chocolate/60">
            <p>
              For too long, great desserts have been reserved for cafés, special occasions, or
              premium dining. We believe they should be enjoyed by everyone, every day.
            </p>
            <p>
              Inspired by comforting indulgences from around the world, we&rsquo;re bringing
              puddings, flans, custards, mousses and more to everyday life — in the right
              portion, at the right price, in an easy-to-enjoy pack.
            </p>
            <p>Because great desserts shouldn&rsquo;t be an occasional luxury.</p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="font-display mt-12 text-2xl italic text-caramel md:text-3xl">
            It&rsquo;s a New Habit.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
