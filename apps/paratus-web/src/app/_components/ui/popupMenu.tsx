import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

/* Build ontop of PopperJS, now Floating-ui, See: https://floating-ui.com/docs/popover */
export default function PopupMenu({
  isOpen,
  setIsOpen,
  button,
  content,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  button: React.ReactNode;
  content: React.ReactNode;
}) {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps({
          onClick: (e) => {
            // had to add e.stopPropagation() if popup was within another clickable element
            e.stopPropagation();
          },
        })}
      >
        {button}
      </div>

      {isOpen && (
        <FloatingFocusManager context={context} modal={true}>
          <div
            ref={refs.setFloating}
            className="z-[1000]"
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}
