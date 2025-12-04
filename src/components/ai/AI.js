import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import {
  Psychology as AiIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const AI = () => {
  // State management
  const [question, setQuestion] = useState("");
  const [threshold, setThreshold] = useState(0.74);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle send button click
  const handleSend = async () => {
    // Validation
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    if (threshold < 0 || threshold > 1) {
      setError("Threshold must be between 0 and 1.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResponse("");

      // Prepare request body
      const requestBody = {
        uuid: "U2FsdGVkX18cSHfkHEqv33IiinlsQRtFUnM0cQqYlqnnEesHStHKEZ5xBgr0kcFvmmkVHhgtdTr5I/Yno KxfiA==",
        securityToken: "Z5h9zvGQJ2E7x6sR9aYL",
        isFreeUser: true,
        conversationId: "",
        isFirstMessage: false,
        conversationName: "Hi",
        userCountry: "RO",
        isDetail: true,
        question: question,
        threshold: threshold,
      };

      // Send POST request
      const apiUrl = "https://vivianlab-claude-test.onrender.com";
      const fullUrl = `${apiUrl}/search`;

      const fetchResponse = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!fetchResponse.ok) {
        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
      }

      const data = await fetchResponse.json();

      // Display formatted JSON response
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false} sx={{ width: "90%", mx: "auto" }}>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <AiIcon sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
          <Typography variant="h4" gutterBottom>
            AI Chat
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Ask questions and get AI-powered responses based on the research
          paper database.
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Question Input */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Question
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />
        </Box>

        {/* Threshold Input */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Threshold (0-1)
          </Typography>
          <TextField
            fullWidth
            type="number"
            variant="outlined"
            placeholder="0.74"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            disabled={loading}
            inputProps={{
              min: 0,
              max: 1,
              step: 0.1,
            }}
            helperText="Set a threshold value between 0 and 1"
          />
        </Box>

        {/* Send Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />
            }
            onClick={handleSend}
            disabled={loading || !question.trim()}
            fullWidth
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </Box>

        {/* Response Display */}
        {response && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Response (JSON)
            </Typography>
            <Paper
              sx={{
                p: 3,
                bgcolor: "grey.50",
                maxHeight: 500,
                overflow: "auto",
                fontFamily: "monospace",
                fontSize: "0.875rem",
                lineHeight: 1.5,
              }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{ whiteSpace: "pre-wrap", margin: 0 }}
              >
                {response}
              </Typography>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AI;