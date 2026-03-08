import { motion } from "framer-motion";
import { Flame, Heart, Rocket, Sparkles } from "lucide-react";

const personalities = [
  {
    icon: Flame,
    title: "Action Addict",
    description: "You live for explosions, car chases, and adrenaline-pumping fight sequences. Your movie nights are loud.",
    gradient: "from-orange-500/20 to-red-600/20",
    iconColor: "text-orange-400",
  },
  {
    icon: Heart,
    title: "Romantic Dreamer",
    description: "Love stories are your kryptonite. You believe in sweeping gestures, beautiful cinematography, and happy endings.",
    gradient: "from-pink-500/20 to-rose-600/20",
    iconColor: "text-pink-400",
  },
  {
    icon: Rocket,
    title: "Sci-Fi Explorer",
    description: "You're drawn to alien worlds, time travel, and mind-bending concepts. The further from reality, the better.",
    gradient: "from-cyan-500/20 to-blue-600/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Sparkles,
    title: "Anime Enthusiast",
    description: "You appreciate the artistry of animation, epic story arcs, and the unique storytelling only anime can deliver.",
    gradient: "from-violet-500/20 to-purple-600/20",
    iconColor: "text-violet-400",
  },
];

export function MoviePersonality() {
  return (
    <section className="container py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Movie Personality</p>
        <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] sm:text-5xl lg:text-6xl">
          What's Your Type?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Take the quiz and discover your cinematic personality type. Which one are you?
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
        {personalities.map((type, index) => (
          <motion.div
            key={type.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.12 }}
            className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-poster transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
            <div className="relative space-y-4">
              <type.icon className={`size-10 ${type.iconColor}`} />
              <h3 className="font-display text-2xl uppercase tracking-[0.06em] text-foreground">{type.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{type.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
