import StorageIcon from "@mui/icons-material/Storage";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HandymaIconn from "@mui/icons-material/Handyman";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TerminalIcon from "@mui/icons-material/Terminal";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

export const getSkillTypeIcon = (skillType) => {
    switch (skillType) {
      case "Database":
        return <StorageIcon />;
      case "Others":
        return <MoreHorizIcon />;
      case "Tool":
        return <HandymaIconn />;
      case "Library":
        return <MenuBookIcon />;
      case "Programming Language":
        return <TerminalIcon />;
      case "Framework":
        return <IntegrationInstructionsIcon />;
      default:
        return <MoreHorizIcon />;
    }
  };

export const getSkillTypeColor = (skillType) => {
    switch (skillType) {
      case "Database":
        return "error";
      case "Others":
        return "default";
      case "Tool":
        return "secondary";
      case "Library":
        return "success";
      case "Programming Language":
        return "primary";
      case "Framework":
        return "warning";
      default:
        return "default";
    }
  };