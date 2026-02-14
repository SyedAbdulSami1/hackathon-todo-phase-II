import { cn } from '@/lib/utils'

// Fade in animation
export function fadeIn(
  className?: string,
  duration = 300,
  delay = 0
) {
  return cn(
    'animate-fade-in',
    className
  )
}

// Slide in animation
export function slideIn(
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  className?: string,
  duration = 300,
  delay = 0
) {
  const directionClasses = {
    up: 'animate-slide-in-up',
    down: 'animate-slide-in-down',
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right'
  }

  return cn(
    directionClasses[direction],
    className
  )
}

// Scale in animation
export function scaleIn(
  className?: string,
  duration = 300,
  delay = 0
) {
  return cn(
    'animate-scale-in',
    className
  )
}

// Stagger animation container
interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
  animation?: 'fade' | 'slide' | 'scale'
}

export function StaggerContainer({
  children,
  staggerDelay = 100,
  className,
  animation = 'fade'
}: StaggerContainerProps) {
  const getAnimationClass = (index: number) => {
    const delay = index * staggerDelay

    switch (animation) {
      case 'fade':
        return cn(
          'animate-fade-in',
          `animation-delay-${delay}`
        )
      case 'slide':
        return cn(
          'animate-slide-in-up',
          `animation-delay-${delay}`
        )
      case 'scale':
        return cn(
          'animate-scale-in',
          `animation-delay-${delay}`
        )
      default:
        return cn(
          'animate-fade-in',
          `animation-delay-${delay}`
        )
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            className: cn(
              child.props.className,
              getAnimationClass(index)
            )
          })
        }
        return child
      })}
    </div>
  )
}

// Pulse animation for loading states
export function Pulse(className?: string) {
  return cn(
    'animate-pulse',
    className
  )
}

// Bounce animation for success/error states
export function Bounce(
  direction: 'up' | 'down' = 'up',
  className?: string
) {
  const directionClasses = {
    up: 'animate-bounce-up',
    down: 'animate-bounce-down'
  }

  return cn(
    directionClasses[direction],
    className
  )
}

// Spin animation for loading spinners
export function Spin(className?: string) {
  return cn(
    'animate-spin',
    className
  )
}

// Custom animation styles to add to global CSS
export const animationStyles = `
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slide-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-in-down {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-in-left {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounce-up {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes bounce-down {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(10px);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }

  .animate-slide-in-up {
    animation: slide-in-up 0.3s ease-out forwards;
  }

  .animate-slide-in-down {
    animation: slide-in-down 0.3s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slide-in-left 0.3s ease-out forwards;
  }

  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out forwards;
  }

  .animate-scale-in {
    animation: scale-in 0.3s ease-out forwards;
  }

  .animate-bounce-up {
    animation: bounce-up 0.5s ease-out;
  }

  .animate-bounce-down {
    animation: bounce-down 0.5s ease-out;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`