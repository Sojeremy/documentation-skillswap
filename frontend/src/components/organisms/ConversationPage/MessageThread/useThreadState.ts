'use client';

import { useState } from 'react';

export function useThreadState() {
  const [messageContent, setMessageContent] = useState('');
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isConfirmEncloseOpen, setIsConfirmEncloseOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConversationEnclosing, setIsConversationEnclosing] = useState(false);
  const [isConversationDeleting, setIsConversationDeleting] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [shouldEncloseAfterRating, setShouldEncloseAfterRating] =
    useState(false);

  return {
    // Message content
    messageContent,
    setMessageContent,
    // Rating dialog
    isRatingOpen,
    setIsRatingOpen,
    isSubmittingRating,
    setIsSubmittingRating,
    // Enclose dialog
    isConfirmEncloseOpen,
    setIsConfirmEncloseOpen,
    isConversationEnclosing,
    setIsConversationEnclosing,
    // Delete dialog
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    isConversationDeleting,
    setIsConversationDeleting,
    // Message submission
    isSubmittingMessage,
    setIsSubmittingMessage,
    // Enclose after rating flag
    shouldEncloseAfterRating,
    setShouldEncloseAfterRating,
  };
}
