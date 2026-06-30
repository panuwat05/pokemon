"use client";

import Link from "next/link";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";

import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function AboutPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        background: "linear-gradient(135deg,#fff8f8 0%,#f4f6fb 100%)",
      }}
    >
      <Container maxWidth="md">
        <Button
          component={Link}
          href="/"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 4,
            borderRadius: 3,
            px: 3,
          }}
        >
          กลับหน้าแรก
        </Button>

        <Card
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            boxShadow: "0 15px 35px rgba(0,0,0,.15)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(90deg,#e53935,#ef5350)",
              color: "white",
              py: 5,
              textAlign: "center",
            }}
          >
            <CatchingPokemonIcon sx={{ fontSize: 60 }} />

            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mt: 1,
              }}
            >
              About This Project
            </Typography>

            <Typography
              sx={{
                opacity: 0.9,
              }}
            >
              Pokemon Information Web Application
            </Typography>
          </Box>

          <CardContent sx={{ p: 5 }}>
            <Typography
              sx={{
                textAlign: "center",
                color: "text.secondary",
                lineHeight: 1.9,
              }}
            >
              โปรเจกต์นี้จัดทำขึ้นเพื่อศึกษาการพัฒนาเว็บไซต์ด้วย
              <strong> Next.js </strong>,
              <strong> Material UI </strong>
              และเชื่อมต่อกับ
              <strong> PokeAPI </strong>
              เพื่อแสดงข้อมูลโปเกมอนทั้งหมด รองรับ Responsive Design,
              Pagination และการแสดงรายละเอียดของโปเกมอน
            </Typography>

            <Divider sx={{ my: 5 }} />

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: "bold",
              }}
            >
              <PersonIcon
                sx={{
                  verticalAlign: "middle",
                  mr: 1,
                }}
              />
              Developer Information
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 5,
                bgcolor: "#fafafa",
                borderRadius: 4,
                border: "1px solid #e5e5e5",
              }}
            >
              <Stack spacing={3} alignItems="center">
                <Avatar
                  src="/images/profile.jpg"
                  alt="Profile"
                  sx={{
                    width: 180,
                    height: 180,
                    border: "5px solid white",
                    boxShadow: "0 10px 30px rgba(0,0,0,.2)",
                  }}
                />

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  ภาณุวัฒน์ ประเสริฐดี
                </Typography>

                <Typography color="text.secondary">
                  Front-end Web Developer
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Tooltip title="GitHub">
                    <IconButton
                      component="a"
                      href="https://github.com/panuwat05"
                      target="_blank"
                      sx={{
                        bgcolor: "#24292e",
                        color: "white",
                        transition: ".3s",
                        "&:hover": {
                          bgcolor: "#000",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Facebook">
                    <IconButton
                      component="a"
                      href="https://www.facebook.com/panuwat.prasertdee"
                      target="_blank"
                      sx={{
                        bgcolor: "#1877F2",
                        color: "white",
                        transition: ".3s",
                        "&:hover": {
                          bgcolor: "#145DBF",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <FacebookIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Instagram">
                    <IconButton
                      component="a"
                      href="https://www.instagram.com/txgxr_panu/"
                      target="_blank"
                      sx={{
                        background:
                          "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                        color: "white",
                        transition: ".3s",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <InstagramIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Divider flexItem sx={{ my: 2 }} />

                <Stack spacing={2} width="100%">
                  <Typography>
                    <strong>ชื่อ-นามสกุล :</strong> ภาณุวัฒน์ ประเสริฐดี
                  </Typography>

                  <Typography>
                    <strong>รหัสนักศึกษา :</strong> 673450474-0
                  </Typography>

                  <Typography>
                    <strong>สาขาวิชา :</strong> Computer and Information Science
                  </Typography>

                  <Typography>
                    <strong>รายวิชา :</strong> Front-end Web Programming
                  </Typography>

                  <Typography>
                    <strong>คณะ :</strong> คณะสหวิทยาการ
                  </Typography>

                  <Typography>
                    <SchoolIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    มหาวิทยาลัยขอนแก่น วิทยาเขตหนองคาย
                  </Typography>
                </Stack>
              </Stack>
            </Paper>

            <Divider sx={{ my: 5 }} />

            <Box textAlign="center">
              <Button
                variant="contained"
                startIcon={<GitHubIcon />}
                href="https://github.com/panuwat05/pokemon"
                target="_blank"
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: "bold",
                  bgcolor: "#24292e",
                  transition: ".3s",
                  "&:hover": {
                    bgcolor: "#000",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                View Source on GitHub
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}