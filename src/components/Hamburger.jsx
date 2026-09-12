const Hamburger = ({ isOpen, onClick }) => (
  <button
    type="button"
    className="flex h-9 w-9 items-center justify-center rounded-md text-snow"
    onClick={onClick}
    aria-label="Toggle menu"
    aria-expanded={isOpen}
  >
    {isOpen ? (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ) : (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    )}
  </button>
);

export default Hamburger;
