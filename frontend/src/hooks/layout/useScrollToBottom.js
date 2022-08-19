const useScrollToBottom = (ref) => {
  const scrollToBottom = () => {
    ref.current.scrollIntoView();
  };

  return scrollToBottom;
};

export default useScrollToBottom;
