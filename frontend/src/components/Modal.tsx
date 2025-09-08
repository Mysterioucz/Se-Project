"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Image from "next/image";
import {
    ModalVariant,
    ModalProps,
    themeColors
} from './Helper'

export default function Modal({
  open,
  onClose,
  topic,
  icon,
  subTopic,
  description,
  leftButtonText,
  rightButtonText,
  onLeftButton,
  onRightButton,
  variant,
  preventClose = false,
  disableRightButton = false,
}: ModalProps) {
  const colors = themeColors[variant];

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (preventClose || reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        onClose?.();
      }}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1.5}>
          {icon && <Image src={icon} alt="icon" width={32} height={32} />}
          <Box>
            <Typography variant="h6" sx={{ color: colors.topic }}>
              {topic}
            </Typography>
            {subTopic && (
              <Typography variant="subtitle2" sx={{ color: colors.subTopic }}>
                {subTopic}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: colors.description }}>
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={onLeftButton}
          sx={{
            color: colors.button.left.color,
            borderColor: colors.button.left.border,
          }}
        >
          {leftButtonText}
        </Button>

        <Button
          variant="contained"
          onClick={onRightButton}
          disabled={disableRightButton}
          sx={{
            backgroundColor: disableRightButton
              ? "var(--color-gray-400)"
              : colors.button.right.bg,
            color: disableRightButton
              ? "var(--color-gray-700)"
              : colors.button.right.color,
            cursor: disableRightButton ? "not-allowed" : "pointer",
            opacity: disableRightButton ? 0.6 : 1,
            "&:hover": {
              backgroundColor: disableRightButton
                ? "var(--color-gray-400)"
                : colors.button.right.hoverBg,
            },
          }}
        >
          {rightButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}