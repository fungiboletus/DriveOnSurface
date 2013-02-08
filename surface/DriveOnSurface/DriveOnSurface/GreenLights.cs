using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace DriveOnSurface
{
    class GreenLights : IDrawableObject
    {

        public enum GLState { Waiting, R3, R2, R1, GO };

        public Sprite redLight;

        public Sprite greenLight;

        public Sprite startFlag;

        public GLState currentState = GLState.Waiting;

        public int last_update;

        public GreenLights()
        {
            redLight = new Sprite();
            greenLight = new Sprite();
            startFlag = new Sprite();

            Vector2 Position = new Vector2(640, 424);

            greenLight.Position = Position;
            redLight.Position = Position;
            startFlag.Position = new Vector2(1920 / 2, 1080 / 2);
            startFlag.origin = new Vector2(640 / 2, 640 / 2);

            greenLight.rotation = 0;
            redLight.rotation = 0;
            startFlag.rotation = 0;

            greenLight.depth = 0.05f;
            redLight.depth = 0.05f;
            startFlag.depth = 0.05f;
        }

        public string getID()
        {
            return "green_lights";
        }

        public void Draw(SpriteBatch sb)
        {
            if (currentState == GLState.Waiting)
            {
                startFlag.Draw(sb);
            }
            else if (currentState == GLState.R3)
            {
                redLight.Position.X = 480;
                redLight.Draw(sb);
                redLight.Position.X += 320;
                redLight.Draw(sb);
                redLight.Position.X += 320;
                redLight.Draw(sb);
            }
            else if (currentState == GLState.R2)
            {
                redLight.Position.X = 480;
                redLight.Draw(sb);
                redLight.Position.X += 320;
                redLight.Draw(sb);
                greenLight.Position.X = 1120;
                greenLight.Draw(sb);
            }
            else if (currentState == GLState.R1)
            {
                redLight.Position.X = 480;
                redLight.Draw(sb);
                greenLight.Position.X = 800;
                greenLight.Draw(sb);
                greenLight.Position.X += 320;
                greenLight.Draw(sb);
            }
            else if (currentState == GLState.GO)
            {
                greenLight.Position.X = 480;
                greenLight.Draw(sb);
                greenLight.Position.X += 320;
                greenLight.Draw(sb);
                greenLight.Position.X += 320;
                greenLight.Draw(sb);
            }
        }

        public void LoadContent(ContentManager theContentManager)
        {
            greenLight.LoadContent(theContentManager, "green_light");
            redLight.LoadContent(theContentManager, "red_light");
            startFlag.LoadContent(theContentManager, "start-flag");
        }
    }
}
