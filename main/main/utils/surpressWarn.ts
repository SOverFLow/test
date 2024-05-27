export default function surpressWarn() {
  const originalWarn = console.error;
  console.error = (...args) => {
    if (/Support for defaultProps will be removed/.test(args[0])) {
      return;
    }
    originalWarn.call(console, ...args);
  };
}

function surpressSupabaseWarn(){
  const originalConsoleWarn = console.warn;
  console.warn = function (message, ...args) {
      if (message.includes("Using supabase.auth.getSession() is potentially insecure")) {
          return;
      }
      originalConsoleWarn(message, ...args);
  };
}

export { surpressSupabaseWarn };