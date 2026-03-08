import { motion } from "framer-motion";
import { Flame, Heart, Rocket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const personalities = [
  {
    icon: Flame,
    title: "Action Addict",
    description: "You live for explosions, car chases, and adrenaline. Your movie nights are loud.",
    color: "bg-orange-500/15 text-orange-400",
  },
  {
    icon: Heart,
    title: "Romantic Dreamer",
    description: "Love stories are your thing. Sweeping gestures, beautiful cinematography, happy endings.",
    color: "bg-pink-500/15 text-pink-400",
  },
  {
    icon: Rocket,
    title: "Sci-Fi Explorer",
    description: "Alien worlds, time travel, and mind-bending concepts. The further from reality, the better.",
    color: "bg-accent/15 text-accent",
  },
  {
    icon: Sparkles,
    title: "Anime Enthusiast",
    description: "The artistry of animation, epic arcs, and storytelling only anime can deliver.",
    color: "bg-violet-500/15 text-violet-400",
  },
];

export function MoviePersonality() {
  return (
    <section className="container py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-foreground">What's Your Type?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Take the quiz and discover your cinematic personality.</p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {personalities.map((type, index) => (
          <motion.div
            key={type.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group rounded-lg bg-card p-6 transition-all duration-300 hover:bg-secondary hover:scale-[1.02]"
          >
            <div className={`mb-3 flex size-10 items-center justify-center rounded-lg ${type.color}`}>
              <type.icon className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">{type.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{type.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
