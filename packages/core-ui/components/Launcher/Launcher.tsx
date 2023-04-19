import React, { useState } from 'react';
import { AiFillAppstore } from 'react-icons/ai';
import { Paper } from '../Paper/Paper';
import { Box, BoxAnimate } from '../Box/Box';
import { NavigationMenuDemo } from '../Navigation';

export const Launcher = ({ children }) => {
  const [panel, setPanel] = useState(false);
  return (
    <Box>
      <Paper>
        <Box
          width={330}
          css={{
            position: 'relative',
          }}
          px={0}
        >
          <Box
            fgColor={11}
            width={50}
            onMouseEnter={() => setPanel(true)}
            onMouseLeave={() => setPanel(false)}
          >
            <AiFillAppstore size={35} />
          </Box>
          <BoxAnimate
            css={{
              position: 'absolute',
              top: 50,
            }}
            onMouseEnter={() => setPanel(true)}
            onMouseLeave={() => setPanel(false)}
            elevation={1}
            br={1}
            p={1}
            ml={-1}
            bgColor="white.0"
            animate={{ scaleX: panel ? 1 : 0, scaleY: panel ? 1 : 0 }}
          >
            {children}
          </BoxAnimate>
        </Box>
      </Paper>
    </Box>
  );
};
