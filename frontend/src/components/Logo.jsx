export default function Logo({ size = 34 }) {
  return (
    <img 
      src="/logo.png" 
      alt="Guruji logo" 
      width={size} 
      height={size} 
      style={{ objectFit: 'contain', borderRadius: '50%' }}
    />
  );
}
