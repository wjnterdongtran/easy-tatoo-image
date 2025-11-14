#!/bin/bash

# Toggle Debug Mode Script
# Usage: ./scripts/toggle-debug.sh [on|off]

ENV_FILE=".env.local"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create .env.local if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Creating .env.local...${NC}"
    cp .env.example "$ENV_FILE" 2>/dev/null || echo "NEXT_PUBLIC_DEBUG_MODE=false" > "$ENV_FILE"
fi

# Function to enable debug mode
enable_debug() {
    if grep -q "NEXT_PUBLIC_DEBUG_MODE" "$ENV_FILE"; then
        # Update existing line
        sed -i.bak 's/NEXT_PUBLIC_DEBUG_MODE=.*/NEXT_PUBLIC_DEBUG_MODE=true/' "$ENV_FILE"
        rm -f "${ENV_FILE}.bak"
    else
        # Add new line
        echo "NEXT_PUBLIC_DEBUG_MODE=true" >> "$ENV_FILE"
    fi

    echo -e "${GREEN}✅ Debug mode ENABLED${NC}"
    echo -e "${YELLOW}🐛 Features:${NC}"
    echo "   - No Supabase required"
    echo "   - Mock authentication"
    echo "   - localStorage storage"
    echo "   - Yellow banner visible"
    echo ""
    echo -e "${YELLOW}⚠️  Restart your dev server: npm run dev${NC}"
}

# Function to disable debug mode
disable_debug() {
    if grep -q "NEXT_PUBLIC_DEBUG_MODE" "$ENV_FILE"; then
        sed -i.bak 's/NEXT_PUBLIC_DEBUG_MODE=.*/NEXT_PUBLIC_DEBUG_MODE=false/' "$ENV_FILE"
        rm -f "${ENV_FILE}.bak"
    else
        echo "NEXT_PUBLIC_DEBUG_MODE=false" >> "$ENV_FILE"
    fi

    echo -e "${GREEN}✅ Debug mode DISABLED${NC}"
    echo -e "${RED}🔒 Production mode:${NC}"
    echo "   - Supabase required"
    echo "   - Real authentication"
    echo "   - Database storage"
    echo ""
    echo -e "${YELLOW}⚠️  Ensure Supabase credentials are set${NC}"
    echo -e "${YELLOW}⚠️  Restart your dev server: npm run dev${NC}"
}

# Check current status
check_status() {
    if grep -q "NEXT_PUBLIC_DEBUG_MODE=true" "$ENV_FILE"; then
        echo -e "${YELLOW}Current status: DEBUG MODE ON 🐛${NC}"
    else
        echo -e "${GREEN}Current status: PRODUCTION MODE 🔒${NC}"
    fi
}

# Main logic
case "$1" in
    on|enable|true)
        enable_debug
        ;;
    off|disable|false)
        disable_debug
        ;;
    status|check)
        check_status
        ;;
    *)
        echo "Usage: $0 {on|off|status}"
        echo ""
        echo "Commands:"
        echo "  on      Enable debug mode (localStorage, mock auth)"
        echo "  off     Disable debug mode (Supabase, real auth)"
        echo "  status  Check current debug mode status"
        echo ""
        check_status
        exit 1
        ;;
esac

exit 0
