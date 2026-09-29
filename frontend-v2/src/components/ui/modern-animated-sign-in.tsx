'use client';

import React, {
  memo,
  ReactNode,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import Image from 'next/image';
import {
  motion,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==================== Input Component ====================

const Input = memo(
  forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    function Input({ className, type, ...props }, ref) {
      const radius = 100; // change this to increase the radius of the hover effect
      const [visible, setVisible] = useState(false);

      const mouseX = useMotionValue(0);
      const mouseY = useMotionValue(0);

      function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
      }: React.MouseEvent<HTMLDivElement>) {
        const { left, top } = currentTarget.getBoundingClientRect();

        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }

      return (
        <motion.div
          style={{
            background: useMotionTemplate`
          radial-gradient(
            ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
            #c8102e,
            transparent 80%
          )
        `,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className="group/input rounded-lg p-[2px] transition duration-300"
        >
          <input
            type={type}
            className={cn(
              `shadow-input flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:placeholder:text-neutral-500 dark:focus-visible:ring-primary`,
              className
            )}
            ref={ref}
            {...props}
          />
        </motion.div>
      );
    }
  )
);

Input.displayName = 'Input';

// ==================== BoxReveal Component ====================

export type BoxRevealProps = {
  children: ReactNode;
  width?: string;
  boxColor?: string;
  duration?: number;
  overflow?: string;
  position?: string;
  className?: string;
};

const BoxReveal = memo(function BoxReveal({
  children,
  width = 'fit-content',
  boxColor,
  duration,
  overflow = 'hidden',
  position = 'relative',
  className,
}: BoxRevealProps) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start('visible');
      mainControls.start('visible');
    } else {
      slideControls.start('hidden');
      mainControls.start('hidden');
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div
      ref={ref}
      style={{
        position: position as
          | 'relative'
          | 'absolute'
          | 'fixed'
          | 'sticky'
          | 'static',
        width,
        overflow,
      }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: duration ?? 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: '100%' } }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: duration ?? 0.5, ease: 'easeIn' }}
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor ?? '#c8102e',
          borderRadius: 4,
        }}
      />
    </div>
  );
});

// ==================== Ripple Component ====================

export type RippleProps = {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
};

const Ripple = memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 11,
  className = '',
}: RippleProps) {
  return (
    <section
      className={`max-w-[50%] absolute inset-0 flex items-center justify-center
        dark:bg-white/5 bg-neutral-50
        [mask-image:linear-gradient(to_bottom,black,transparent)]
        dark:[mask-image:linear-gradient(to_bottom,white,transparent)] ${className}`}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? 'dashed' : 'solid';
        const borderOpacity = 5 + i * 5;

        return (
          <span
            key={i}
            className="absolute animate-ripple rounded-full bg-foreground/15 border"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              animationDelay: animationDelay,
              borderStyle: borderStyle,
              borderWidth: '1px',
              borderColor: `hsl(var(--foreground) / ${borderOpacity / 100})`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </section>
  );
});

// ==================== OrbitingCircles Component ====================

export type OrbitingCirclesProps = {
  className?: string;
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
};

const OrbitingCircles = memo(function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 50,
  path = true,
}: OrbitingCirclesProps) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-black/10 stroke-1 dark:stroke-white/10"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      <div
        style={
          {
            '--duration': duration,
            '--radius': radius,
            '--delay': -delay,
          } as React.CSSProperties
        }
        className={cn(
          'absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-black/5 [animation-delay:calc(var(--delay)*1000ms)] dark:bg-white/5',
          { '[animation-direction:reverse]': reverse },
          className
        )}
      >
        {children}
      </div>
    </>
  );
});

// ==================== TechOrbitDisplay Component ====================

export type IconConfig = {
  className?: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
  component: () => React.ReactNode;
};

export type TechnologyOrbitDisplayProps = {
  iconsArray: IconConfig[];
  text?: string;
};

const TechOrbitDisplay = memo(function TechOrbitDisplay({
  iconsArray,
  text = 'CodeSkill',
}: TechnologyOrbitDisplayProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-400/80 bg-clip-text text-center text-6xl lg:text-7xl font-bold font-mono leading-none text-transparent dark:from-white dark:to-slate-700/40">
        {text}
      </span>

      {iconsArray.map((icon, index) => (
        <OrbitingCircles
          key={index}
          className={icon.className}
          duration={icon.duration}
          delay={icon.delay}
          radius={icon.radius}
          path={icon.path}
          reverse={icon.reverse}
        >
          {icon.component()}
        </OrbitingCircles>
      ))}
    </div>
  );
});

// ==================== AnimatedForm Component ====================

export type FieldType = 'text' | 'email' | 'password';

export type Field = {
  label: string;
  required?: boolean;
  type: FieldType;
  placeholder?: string;
  value?: string;
  name?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type AnimatedFormProps = {
  header: string;
  subHeader?: string;
  fields: Field[];
  submitButton: string;
  textVariantButton?: string;
  errorField?: string;
  fieldPerRow?: number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  googleLogin?: string;
  onGoogleLogin?: () => void;
  goTo?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
};

type Errors = {
  [key: string]: string;
};

const AnimatedForm = memo(function AnimatedForm({
  header,
  subHeader,
  fields,
  submitButton,
  textVariantButton,
  errorField,
  fieldPerRow = 1,
  onSubmit,
  googleLogin,
  onGoogleLogin,
  goTo,
}: AnimatedFormProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const toggleVisibility = () => setVisible(!visible);

  const validateForm = (event: FormEvent<HTMLFormElement>) => {
    const currentErrors: Errors = {};
    fields.forEach((field) => {
      const fieldKey = field.name || field.label.toLowerCase();
      const inputElement = (event.currentTarget.elements.namedItem(fieldKey) ||
        event.currentTarget.elements.namedItem(field.label)) as HTMLInputElement;
      const value = field.value ?? inputElement?.value;

      if (field.required && !value) {
        currentErrors[field.label] = `${field.label} is required`;
      }

      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        currentErrors[field.label] = 'Invalid email address';
      }

      if (field.type === 'password' && value && value.length < 6) {
        currentErrors[field.label] = 'Password must be at least 6 characters long';
      }
    });
    return currentErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formErrors = validateForm(event);

    if (Object.keys(formErrors).length === 0) {
      setErrors({});
      onSubmit(event);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="max-md:w-full flex flex-col gap-4 w-full max-w-sm mx-auto">
      <BoxReveal duration={0.3}>
        <h2 className="font-bold text-3xl text-neutral-900 dark:text-neutral-100 tracking-tight">
          {header}
        </h2>
      </BoxReveal>

      {subHeader && (
        <BoxReveal duration={0.3} className="pb-2">
          <p className="text-neutral-600 text-sm max-w-sm dark:text-neutral-400">
            {subHeader}
          </p>
        </BoxReveal>
      )}

      {googleLogin && (
        <>
          <BoxReveal duration={0.3} overflow="visible" width="100%">
            <button
              className="g-button group/btn bg-background hover:bg-muted/60 transition-colors w-full rounded-md border border-border h-10 font-medium outline-hidden hover:cursor-pointer shadow-xs"
              type="button"
              onClick={onGoogleLogin ?? (() => console.log('Google login clicked'))}
            >
              <span className="flex items-center justify-center w-full h-full gap-2.5 text-sm text-foreground">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {googleLogin}
              </span>
              <BottomGradient />
            </button>
          </BoxReveal>

          <BoxReveal duration={0.3} width="100%">
            <div className="flex items-center gap-4 py-1">
              <hr className="flex-1 border-t border-dashed border-border" />
              <p className="text-muted-foreground text-xs uppercase tracking-wider">
                or
              </p>
              <hr className="flex-1 border-t border-dashed border-border" />
            </div>
          </BoxReveal>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className={`grid grid-cols-1 md:grid-cols-${fieldPerRow} gap-3`}>
          {fields.map((field) => (
            <div key={field.label} className="flex flex-col gap-1.5">
              <BoxReveal duration={0.3}>
                <Label htmlFor={field.name || field.label}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
              </BoxReveal>

              <BoxReveal duration={0.3} width="100%" className="flex flex-col space-y-1 w-full">
                <div className="relative">
                  <Input
                    type={
                      field.type === 'password'
                        ? visible
                          ? 'text'
                          : 'password'
                        : field.type
                    }
                    id={field.name || field.label}
                    name={field.name || field.label.toLowerCase()}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={field.onChange}
                  />

                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                      {visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>

                {errors[field.label] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.label]}
                  </p>
                )}
              </BoxReveal>
            </div>
          ))}
        </div>

        {errorField && (
          <BoxReveal width="100%" duration={0.3}>
            <p className="text-red-500 text-xs">{errorField}</p>
          </BoxReveal>
        )}

        <BoxReveal width="100%" duration={0.3} overflow="visible">
          <button
            className="bg-primary hover:bg-primary/90 text-primary-foreground relative group/btn block w-full rounded-md h-10 font-medium transition-all shadow-xs outline-hidden hover:cursor-pointer mt-2"
            type="submit"
          >
            {submitButton} &rarr;
            <BottomGradient />
          </button>
        </BoxReveal>

        {textVariantButton && goTo && (
          <BoxReveal duration={0.3} width="100%">
            <div className="text-center pt-2">
              <button
                type="button"
                className="text-xs text-primary hover:underline outline-hidden cursor-pointer"
                onClick={goTo}
              >
                {textVariantButton}
              </button>
            </div>
          </BoxReveal>
        )}
      </form>
    </div>
  );
});

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-xs block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
    </>
  );
};

// ==================== AuthTabs Component ====================

export interface AuthTabsProps {
  formFields: {
    header: string;
    subHeader?: string;
    fields: Array<{
      label: string;
      name?: string;
      value?: string;
      required?: boolean;
      type: FieldType;
      placeholder?: string;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    }>;
    submitButton: string;
    textVariantButton?: string;
    errorField?: string;
  };
  goTo?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleLogin?: () => void;
}

const AuthTabs = memo(function AuthTabs({
  formFields,
  goTo,
  handleSubmit,
  onGoogleLogin,
}: AuthTabsProps) {
  return (
    <div className="flex justify-center w-full">
      <AnimatedForm
        {...formFields}
        fieldPerRow={1}
        onSubmit={handleSubmit}
        goTo={goTo}
        googleLogin="Continue with Google"
        onGoogleLogin={onGoogleLogin}
      />
    </div>
  );
});

// ==================== Label Component ====================

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

const Label = memo(function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-xs font-semibold uppercase tracking-wider text-muted-foreground',
        className
      )}
      {...props}
    />
  );
});

// ==================== Exports ====================

export {
  Input,
  BoxReveal,
  Ripple,
  OrbitingCircles,
  TechOrbitDisplay,
  AnimatedForm,
  AuthTabs,
  Label,
  BottomGradient,
};

export default AuthTabs;
