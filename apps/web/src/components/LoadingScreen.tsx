import * as motion from 'motion/react-client';

export function LoadingScreen() {
  return (
    <div className="fixed flex items-center justify-center w-full h-full bottom-0 right-0 bg-background-default">
      <motion.div
        animate={{
          scale: [1, 0.9, 0.9, 1, 1],
          opacity: [1, 0.48, 0.48, 1, 1],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeatDelay: 1,
          repeat: Infinity,
        }}
      >
        <img
          width={64}
          height={64}
          src="/logo/simbolo_transp_dark.png"
          alt="Copera Logo"
        />
      </motion.div>

      <motion.div
        animate={{
          scale: [1.6, 1, 1, 1.6, 1.6],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        className="absolute w-[100px] h-[100px] border-3 border-primary/24"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{
          ease: 'linear',
          duration: 3.2,
          repeat: Infinity,
        }}
        className="absolute w-[120px] h-[120px] border-8 border-primary/24"
      />
    </div>
  );
}
