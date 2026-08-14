export default function Logo({ size = 34 }) {
  return (
    <img 
      src={`${import.meta.env.BASE_URL}logo.png`} 
      alt="Guruji logo" 
      width={size} 
      height={size} 
      style={{ objectFit: 'contain', borderRadius: '50%' }}
    />
  );
}
